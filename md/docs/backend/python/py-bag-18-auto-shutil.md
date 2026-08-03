---
title: "Python shutil包"

description: "Python shutil包常用函数参考，包括文件复制、移动、删除、归档等操作。"

date: "2026-04-21"

tags: [Python, shutil, 文件操作]

sidebar: auto

---


# Python shutil包常用函数参考

| 函数名 | 必选参数 | 作用 |
|-------|---------|------|
| `shutil.copy(src, dst)` | src: 源文件路径, dst: 目标文件路径 | 复制文件 |
| `shutil.copy2(src, dst)` | src: 源文件路径, dst: 目标文件路径 | 复制文件并保留元数据 |
| `shutil.copyfile(src, dst)` | src: 源文件路径, dst: 目标文件路径 | 仅复制文件内容 |
| `shutil.copyfileobj(fsrc, fdst[, length])` | fsrc: 源文件对象, fdst: 目标文件对象 | 复制文件对象内容 |
| `shutil.copytree(src, dst[, symlinks, ignore, ...])` | src: 源目录路径, dst: 目标目录路径 | 递归复制目录 |
| `shutil.rmtree(path[, ignore_errors, onerror])` | path: 目录路径 | 递归删除目录 |
| `shutil.move(src, dst)` | src: 源路径, dst: 目标路径 | 移动或重命名文件/目录 |
| `shutil.make_archive(base_name, format[, root_dir, ...])` | base_name: 归档文件名, format: 归档格式 | 创建压缩归档文件 |
| `shutil.unpack_archive(filename[, extract_dir, format])` | filename: 归档文件路径 | 解压缩归档文件 |
| `shutil.chown(path, user[, group])` | path: 文件路径, user: 用户名 | 更改文件所有者 |
| `shutil.which(cmd[, mode, path])` | cmd: 命令名称 | 查找命令的路径 |
| `shutil.disk_usage(path)` | path: 路径 | 获取磁盘使用情况 |
| `shutil.get_terminal_size([fallback])` | 无 | 获取终端大小 |
| `shutil.ignore_patterns(*patterns)` | patterns: 忽略模式 | 创建忽略规则函数 |
| `shutil.copymode(src, dst)` | src: 源路径, dst: 目标路径 | 复制权限模式 |
| `shutil.copystat(src, dst)` | src: 源路径, dst: 目标路径 | 复制文件状态 |
| `shutil.copymode(src, dst)` | src: 源路径, dst: 目标路径 | 复制权限模式 |
| `shutil.copystat(src, dst)` | src: 源路径, dst: 目标路径 | 复制文件状态 |

## 常用参数说明

### 核心参数
| 参数名 | 类型 | 作用 |
|-------|------|------|
| `src` | str | 源文件或目录路径 |
| `dst` | str | 目标文件或目录路径 |
| `path` | str | 文件或目录路径 |
| `fsrc` | file-like | 源文件对象 |
| `fdst` | file-like | 目标文件对象 |
| `length` | int | 复制缓冲区大小 |
| `symlinks` | bool | 是否复制符号链接 |
| `ignore` | callable | 忽略规则函数 |
| `format` | str | 归档格式，如'zip', 'tar', 'gztar'等 |
| `base_name` | str | 归档文件的基础名称 |
| `user` | str | 用户名 |
| `group` | str | 组名 |
| `cmd` | str | 命令名称 |
| `patterns` | str | 忽略模式 |

### 归档格式
| 格式 | 说明 | 文件扩展名 |
|------|------|------------|
| `'zip'` | ZIP格式 | .zip |
| `'tar'` | 未压缩的tar格式 | .tar |
| `'gztar'` | gzip压缩的tar格式 | .tar.gz |
| `'bztar'` | bzip2压缩的tar格式 | .tar.bz2 |
| `'xztar'` | xz压缩的tar格式 | .tar.xz |

### 忽略规则
| 函数                       | 作用          | 示例                                               |
| ------------------------ | ----------- | ------------------------------------------------ |
| `shutil.ignore_patterns` | 创建忽略指定模式的函数 | `shutil.ignore_patterns('*.pyc', '__pycache__')` |
| 自定义忽略函数                  | 自定义忽略逻辑     | 接受(src, names)参数，返回要忽略的名称列表                      |