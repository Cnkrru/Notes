# Command Kit

指令集 SKILL，提供常用开发指令的快速参考与执行指南。

## 作者

Author: TBD

## 指令列表

### 增（Create）

| 序号 | 指令格式 | 参数 | 示例 |
|------|----------|------|------|
| 1 | `mk-<扩展名>-<文件名>` | 扩展名：文件扩展名（不含点号）；文件名：文件名称（不含扩展名） | `mk-ts-index` → `index.ts`、`mk-vue-App` → `App.vue` |
| 2 | `mk-<文件夹名>` | 文件夹名：要创建的文件夹名称 | `mk-components` → 创建 `components` 文件夹 |

### 删（Delete）

| 序号 | 指令格式 | 参数 | 示例 |
|------|----------|------|------|
| 3 | `rm-<扩展名>-<文件名>` | 扩展名：文件扩展名（不含点号）；文件名：文件名称（不含扩展名） | `rm-ts-index` → 删除 `index.ts`、`rm-vue-App` → 删除 `App.vue` |
| 4 | `rm-<文件夹名>` | 文件夹名：要删除的文件夹名称 | `rm-src` → 删除 `src` 文件夹 |

### 改（Update）

| 序号 | 指令格式 | 参数 | 示例 |
|------|----------|------|------|
| 5 | `<文件名>-to-<文件夹>` | 文件名：要移动的文件名称（含扩展名）；文件夹：目标文件夹名称 | `index-to-src` → 将 `index` 移动到 `src` 文件夹、`App.vue-to-components` → 将 `App.vue` 移动到 `components` 文件夹 |
| 6 | `<文件夹>-to-<文件夹>` | 源文件夹：要被移动的文件夹名称；目标文件夹：接收移动的文件夹名称 | `components-to-src` → 将 `components` 文件夹移动到 `src` 下、`utils-to-lib` → 将 `utils` 文件夹移动到 `lib` 下 |
| 7 | `rename-<文件名>-<新文件名>` | 文件名：原文件名称（含扩展名）；新文件名：重命名后的文件名称（含扩展名） | `rename-index.ts-app.ts` → 将 `index.ts` 重命名为 `app.ts`、`rename-README.md-说明.md` → 将 `README.md` 重命名为 `说明.md` |
| 8 | `form-<文件夹>` | 文件夹：要整理编号的文件夹名称 | `form-components` → 给 `components` 文件夹内的所有文件/文件夹按顺序编号命名 |

### 查（Read）

（待扩展）

### 系统（System）

| 序号 | 指令格式 | 参数 | 示例 |
|------|----------|------|------|
| 9 | `use-<SKILL名>` | SKILL名：要调用的 SKILL 名称 | `use-vitepress-builder` → 调用 `vitepress-builder` SKILL、`use-command-kit` → 调用 `command-kit` SKILL |
