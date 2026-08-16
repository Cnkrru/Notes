# OpenSSL 3.x EVP 加密 API 实战速查（AL 项目）

> 目标：AL 项目需要用 OpenSSL 3.x 实现 AES-256-GCM 加解密 + scrypt 密钥派生。
> 内容基于官方 man3 文档（OpenSSL 3.4）：
> https://docs.openssl.org/3.4/man3/EVP_EncryptInit_ex/ 、
> https://docs.openssl.org/3.4/man3/PKCS5_PBE_keyivgen/ 、
> https://docs.openssl.org/3.4/man3/RAND_bytes/ 。
> 头文件 `#include <openssl/evp.h>`、`#include <openssl/rand.h>`，链接 `-lcrypto`
> （vcpkg 包名 `openssl`）。

---

## 加密模型概念

- **Provider 模型**：OpenSSL 3.x 起算法由 provider 提供，EVP API 是"高级"统一接口，
  所有对称算法都通过 `EVP_CIPHER *` 算法描述符 + `EVP_CIPHER_CTX *` 上下文来操作。
- **上下文 `EVP_CIPHER_CTX`**：持有算法、key、IV、填充设置和内部状态，所有操作围绕它。
  - 创建 `EVP_CIPHER_CTX_new()`，用完 `EVP_CIPHER_CTX_free()`。
- **对称加密基本流程**（CBC 等普通模式）：

  ```
  EVP_CIPHER_CTX_new → EncryptInit_ex2(算法,key,iv) → EncryptUpdate(数据,可多次)
      → EncryptFinal_ex(处理尾部/填充) → free
  ```

- **AEAD / GCM 模式**：
  - 输出 = 密文 + 认证标签（tag）。解密时校验 tag，不匹配说明数据被篡改。
  - GCM 推荐 IV/nonce 长度 **12 字节（96 位）**，tag 默认 **16 字节**。
  - 附带认证数据 AAD（需要被认证但不需要加密，如 header/版本号）通过
    `EVP_EncryptUpdate(ctx, NULL, &len, aad, aadlen)` 传入（out 参数为 NULL）。
  - 通过 `EVP_CIPHER_CTX_ctrl()` 设置 IV 长度、获取 tag（加密端）、设置期望 tag（解密端）。
- **返回值约定**：`EVP_EncryptInit_ex2` / `EVP_EncryptUpdate` / `EVP_EncryptFinal_ex`
  等**返回 1 成功、0 失败**。解密时 `EVP_DecryptFinal_ex` 返回 0 表示**认证失败**。
- **优先用 `_ex2` 变体**：可以在不重建 ctx 的情况下复用并重设 key/IV
  （第二次调用 `type` 传 NULL），比反复 new/free 更高效。

---

## 关键函数签名（官方 man3 原文）

```c
#include <openssl/evp.h>

EVP_CIPHER_CTX *EVP_CIPHER_CTX_new(void);
void EVP_CIPHER_CTX_free(EVP_CIPHER_CTX *ctx);

int EVP_EncryptInit_ex2(EVP_CIPHER_CTX *ctx, const EVP_CIPHER *type,
                        const unsigned char *key, const unsigned char *iv,
                        const OSSL_PARAM params[]);
int EVP_EncryptUpdate(EVP_CIPHER_CTX *ctx, unsigned char *out,
                      int *outl, const unsigned char *in, int inl);
int EVP_EncryptFinal_ex(EVP_CIPHER_CTX *ctx, unsigned char *out, int *outl);

int EVP_DecryptInit_ex2(EVP_CIPHER_CTX *ctx, const EVP_CIPHER *type,
                        const unsigned char *key, const unsigned char *iv,
                        const OSSL_PARAM params[]);
int EVP_DecryptUpdate(EVP_CIPHER_CTX *ctx, unsigned char *out,
                      int *outl, const unsigned char *in, int inl);
int EVP_DecryptFinal_ex(EVP_CIPHER_CTX *ctx, unsigned char *outm, int *outl);

int EVP_CIPHER_CTX_ctrl(EVP_CIPHER_CTX *ctx, int cmd, int p1, void *p2);
```

GCM 相关的 ctrl 常量（文档以 `EVP_CTRL_AEAD_*` 命名；旧代码常用的
`EVP_CTRL_GCM_SET_IVLEN` / `EVP_CTRL_GCM_GET_TAG` / `EVP_CTRL_GCM_SET_TAG` 是别名）：

```c
EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, ivlen, NULL); // 设 IV 长度（必须在指定 IV 之前）
EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_GET_TAG,  taglen, tag);  // 加密：取 tag（必须在 Final 之后）
EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_TAG,  taglen, tag);  // 解密：设期望 tag（必须在 Final 之前）
```

**要点：**

- AES-256-GCM 的算法描述符是 `EVP_aes_256_gcm()`。
- AES-256-GCM 默认 IV 长度 12、默认 tag 长度 16；用默认 IV 长度时可以省略
  `EVP_CTRL_AEAD_SET_IVLEN`。
- 初始化可分两步：先 `EVP_EncryptInit_ex2(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL)`
  只设算法；再 `EVP_EncryptInit_ex2(ctx, NULL, key, iv, NULL)` 补 key + IV。
  这样可以在两步之间插入 `EVP_CTRL_AEAD_SET_IVLEN`。

---

## 完整 AES-256-GCM 加密函数

```cpp
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <vector>
#include <string>
#include <stdexcept>
#include <cstdint>

// 加密：返回密文（不含 tag）。tag 单独输出（16 字节），需与密文一起存储/传输。
// key : 32 字节（AES-256）
// iv  : 12 字节（GCM 推荐 / 默认长度）
// aad : 可选认证数据，可为空
std::vector<unsigned char> aes256_gcm_encrypt(
    const std::vector<unsigned char>& key,
    const std::vector<unsigned char>& iv,
    const std::vector<unsigned char>& plain,
    const std::vector<unsigned char>& aad,
    std::vector<unsigned char>& tag)          // out: 16 bytes
{
    if (key.size() != 32) throw std::invalid_argument("key must be 32 bytes");
    if (iv.size()  != 12) throw std::invalid_argument("iv must be 12 bytes");
    tag.resize(16);

    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    if (!ctx) throw std::runtime_error("EVP_CIPHER_CTX_new failed");

    // 两步初始化：先设算法，再设 IV 长度，最后设 key + IV
    if (EVP_EncryptInit_ex2(ctx, EVP_aes_256_gcm(), nullptr, nullptr, nullptr) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_EncryptInit_ex2 failed");
    }
    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, (int)iv.size(), nullptr) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("set ivlen failed");
    }
    if (EVP_EncryptInit_ex2(ctx, nullptr, key.data(), iv.data(), nullptr) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_EncryptInit_ex2 failed");
    }

    std::vector<unsigned char> cipher(plain.size() + EVP_MAX_BLOCK_LENGTH);
    int len = 0, total = 0;

    // AAD：out 传 NULL，只认证不加密
    if (!aad.empty()) {
        if (EVP_EncryptUpdate(ctx, nullptr, &len, aad.data(), (int)aad.size()) != 1) {
            EVP_CIPHER_CTX_free(ctx);
            throw std::runtime_error("aad failed");
        }
    }

    if (EVP_EncryptUpdate(ctx, cipher.data(), &len,
                          plain.data(), (int)plain.size()) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_EncryptUpdate failed");
    }
    total = len;

    int tmplen = 0;
    if (EVP_EncryptFinal_ex(ctx, cipher.data() + total, &tmplen) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_EncryptFinal_ex failed");
    }
    total += tmplen;

    // 在所有数据处理完之后取 tag
    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_GET_TAG, (int)tag.size(), tag.data()) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("get tag failed");
    }

    EVP_CIPHER_CTX_free(ctx);
    cipher.resize(total);
    return cipher;
}
```

---

## 完整 AES-256-GCM 解密函数

```cpp
// 解密：成功返回明文；认证失败抛异常（EVP_DecryptFinal_ex 返回 0）。
// 输入的 iv / tag 必须与加密端一致，cipher 为不含 tag 的密文。
std::vector<unsigned char> aes256_gcm_decrypt(
    const std::vector<unsigned char>& key,
    const std::vector<unsigned char>& iv,
    const std::vector<unsigned char>& cipher,   // 不含 tag
    const std::vector<unsigned char>& aad,
    const std::vector<unsigned char>& tag)      // 16 bytes，来自加密端
{
    if (key.size() != 32) throw std::invalid_argument("key must be 32 bytes");
    if (iv.size()  != 12) throw std::invalid_argument("iv must be 12 bytes");
    if (tag.size() != 16) throw std::invalid_argument("tag must be 16 bytes");

    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    if (!ctx) throw std::runtime_error("EVP_CIPHER_CTX_new failed");

    // 两步初始化：先设算法，再设 IV 长度，最后设 key + IV
    if (EVP_DecryptInit_ex2(ctx, EVP_aes_256_gcm(), nullptr, nullptr, nullptr) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_DecryptInit_ex2 failed");
    }
    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_IVLEN, (int)iv.size(), nullptr) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("set ivlen failed");
    }
    if (EVP_DecryptInit_ex2(ctx, nullptr, key.data(), iv.data(), nullptr) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_DecryptInit_ex2 failed");
    }

    std::vector<unsigned char> plain(cipher.size() + EVP_MAX_BLOCK_LENGTH);
    int len = 0, total = 0;

    // AAD：内容与顺序必须和加密端一致
    if (!aad.empty()) {
        if (EVP_DecryptUpdate(ctx, nullptr, &len, aad.data(), (int)aad.size()) != 1) {
            EVP_CIPHER_CTX_free(ctx);
            throw std::runtime_error("aad failed");
        }
    }

    if (EVP_DecryptUpdate(ctx, plain.data(), &len,
                          cipher.data(), (int)cipher.size()) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("EVP_DecryptUpdate failed");
    }
    total = len;

    // 在 Final 之前设置期望的 tag
    if (EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_AEAD_SET_TAG, (int)tag.size(),
                            const_cast<unsigned char*>(tag.data())) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("set tag failed");
    }

    int tmplen = 0;
    if (EVP_DecryptFinal_ex(ctx, plain.data() + total, &tmplen) != 1) {
        EVP_CIPHER_CTX_free(ctx);
        throw std::runtime_error("authentication failed: tag mismatch or corrupt data");
    }
    total += tmplen;

    EVP_CIPHER_CTX_free(ctx);
    plain.resize(total);
    return plain;
}
```

---

## scrypt 密钥派生

```c
#include <openssl/evp.h>

int EVP_PBE_scrypt(const char *pass, size_t passlen,
                   const unsigned char *salt, size_t saltlen,
                   uint64_t N, uint64_t r, uint64_t p, uint64_t maxmem,
                   unsigned char *key, size_t keylen);
```

- 用 scrypt 从口令派生密钥。返回 **1 成功、0 失败**。
- `N`：CPU/内存成本参数，**必须是 2 的幂**；`r`、`p`：内存/并行度参数。
  常用组合 `N = 2^15 (32768), r = 8, p = 1`（约 32 MB 内存）。
- `maxmem`：内存上限，传 `0` 用默认值（OpenSSL 3 默认约 32 MB）。`N` 设过大
  （如 `2^20`）会因超出上限返回失败。
- `salt` 必须随机且每次加密唯一，建议至少 16 字节。**存 salt，不要存口令**。

C++ 示例（口令 + salt → 32 字节 AES key）：

```cpp
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <vector>
#include <string>
#include <stdexcept>

// 派生 32 字节 AES-256 key
std::vector<unsigned char> derive_key_from_password(
    const std::string& password,
    const std::vector<unsigned char>& salt)   // 至少 16 字节
{
    const uint64_t N = 1ULL << 15;   // 32768，可按需调大（须为 2 的幂）
    const uint64_t r = 8;
    const uint64_t p = 1;
    const size_t KEY_LEN = 32;

    std::vector<unsigned char> key(KEY_LEN);
    int ok = EVP_PBE_scrypt(
        password.c_str(), password.size(),
        salt.data(), salt.size(),
        N, r, p, /*maxmem=*/0,
        key.data(), key.size());
    if (ok != 1)
        throw std::runtime_error("EVP_PBE_scrypt failed");
    return key;
}

// 生成随机 salt（每次加密都应当使用新的随机 salt）
std::vector<unsigned char> make_salt(size_t n = 16) {
    std::vector<unsigned char> salt(n);
    if (RAND_bytes(salt.data(), (int)salt.size()) != 1)
        throw std::runtime_error("RAND_bytes failed");
    return salt;
}
```

---

## 随机数 RAND_bytes

```c
#include <openssl/rand.h>

int RAND_bytes(unsigned char *buf, int num);
int RAND_priv_bytes(unsigned char *buf, int num);
int RAND_status(void);
```

- `RAND_bytes()`：用 CSPRNG 生成 `num` 个密码学安全随机字节，存入 `buf`。
  返回 **1 成功、0 失败、-1 当前 RAND 方法不支持**。
- `RAND_priv_bytes()`：语义相同，用于生成私密材料（使用独立的"私有"PRNG 实例）。
- **始终检查返回值**：熵源不可用时 CSPRNG 进入错误状态并拒绝生成随机数。
- 用途：生成随机 IV（12 字节）、salt、密钥。

C++ 示例（生成 12 字节 GCM IV）：

```cpp
std::vector<unsigned char> make_iv() {
    std::vector<unsigned char> iv(12);
    if (RAND_bytes(iv.data(), (int)iv.size()) != 1)
        throw std::runtime_error("RAND_bytes failed");
    return iv;
}
```

---

## 完整流程串起来

```cpp
// ---------- 加密侧 ----------
auto salt   = make_salt();                      // 16 字节随机盐
auto key    = derive_key_from_password(password, salt);
auto iv     = make_iv();                        // 12 字节随机 IV
std::vector<unsigned char> tag;
auto cipher = aes256_gcm_encrypt(key, iv, plain, /*aad=*/{}, tag);
// 存储/传输格式建议：salt || iv || tag || cipher（16+12+16+len）

// ---------- 解密侧 ----------
auto key2   = derive_key_from_password(password, salt);
auto plain2 = aes256_gcm_decrypt(key2, iv, cipher, /*aad=*/{}, tag);
// 认证失败会抛出异常，上层应提示"密码错误或数据被篡改"
```

---

## 编译链接（vcpkg / CMake）

```
vcpkg install openssl

# CMakeLists.txt（本项目只用对称加密，链接 Crypto 即可）
find_package(OpenSSL REQUIRED)
target_link_libraries(app PRIVATE OpenSSL::Crypto)
```
