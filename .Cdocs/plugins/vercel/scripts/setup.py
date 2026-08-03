#!/usr/bin/env python3
# vercel 部署插件：生成 vercel.json（本仓库为「使用方」，无 C++ 源码）
#
# 背景：Vercel 云端构建环境没有 C++ 编译器（现场编译失败过），
# 方案 = 仓库内随带 Linux 版生成器 Cdocs-linux，Vercel 直接运行
#       （chmod +x Cdocs-linux && ./Cdocs-linux build），无需现场编译。
#       Cdocs-linux 由 Cdocs 主仓库的 Build Linux Binary 工作流维护，升级时手动同步。
# 注意：Vercel 项目 Root Directory 保持仓库根（本项目无 web/ 子目录），
#       vercel.json 生成到项目根，buildCommand / outputDirectory 相对根解析。
#
# 用法（由 Cdocs deploy --setup 调用）：setup.py <ctx.json> <out.json>
#   ctx.source = 项目根目录
# 幂等：文件已存在且内容一致则跳过；不一致则覆盖。
import json
import os
import sys

def read_json(p):
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def write_out(out_path, ok, msg):
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"ok": ok, "message": msg}, f, ensure_ascii=False)

VERCEL_JSON = """{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "chmod +x Cdocs-linux && ./Cdocs-linux build",
  "outputDirectory": "dist"
}
"""

def ensure(path, content, out, name):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            if f.read() == content:
                return f"  · {name} 已存在且一致，跳过\n"
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    return f"  · {name} 已生成\n"

def main():
    if len(sys.argv) < 3:
        return
    ctx_path, out_path = sys.argv[1], sys.argv[2]
    ctx = read_json(ctx_path)
    source = ctx.get("source", ".")

    msgs = []
    # vercel.json 生成到项目根（Vercel Root Directory = 仓库根）
    msgs.append(ensure(os.path.join(source, "vercel.json"), VERCEL_JSON, out_path, "vercel.json"))

    # 提示：本仓库无 C++ 源码，不生成 build-linux-binary.yml（Cdocs-linux 手动同步）
    binp = os.path.join(source, "Cdocs-linux")
    hint = ""
    if not os.path.exists(binp):
        hint = "（注意：Cdocs-linux 不存在——请从 Cdocs 主仓库同步 Linux 版生成器到仓库根，否则 Vercel 构建会失败）"

    write_out(out_path, True, "".join(msgs).strip() + hint)

if __name__ == "__main__":
    main()
