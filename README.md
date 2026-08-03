# Cnkrru'notes

个人技术笔记知识库，由 [Cdocs](https://github.com/Cnkrru/Cdocs) 静态站点生成器驱动（C++17 零依赖单文件引擎）。

内容涵盖：**后端 / 前端 / 框架 / 电气 / 硬件 / 数据格式 / 代码特效 / Skills** 等领域，共 212 篇文档。

## 快速开始

```bash
# 构建站点（输出到 dist/）
Cdocs build

# 本地预览（内置 HTTP 服务器，默认 http://localhost:8088）
Cdocs serve

# 新建一篇文档（写入 md/docs/ 并自动登记导航）
Cdocs add <页面名>
```

> 生成器已发布到 PATH（`Cdocs` 命令全局可用）；也可用仓库根自带的分发包/二进制。

## 目录结构

```
notes/
├── md/docs/           # 笔记内容（Markdown，front matter 含 title/description/date/tags）
├── .Cdocs/            # Cdocs 引擎配置
│   ├── config/
│   │   ├── config.json        # 站点配置（标题/导航/首页 hero/功能开关）
│   │   └── route/docs.json    # 侧边栏导航（按技术领域分组）
│   ├── i18n/                  # 多语言字典（zh-CN / en）
│   ├── plugins/               # 部署插件（github-pages / vercel）
│   └── theme/                 # 主题（水墨风 ink）
├── Cdocs-linux        # Linux 版生成器（云端部署直接运行）
├── vercel.json        # Vercel 部署配置
└── .github/workflows/ # GitHub Pages 自动部署
```

## 内容组织

| 领域 | 目录 | 说明 |
| --- | --- | --- |
| 后端 | `md/docs/backend/` | Python / C / JavaScript / Shell / 正则 / Rust / 算法 / 力扣 / AJAX |
| 框架 | `md/docs/框架/` | Vue / FastAPI |
| 前端 | `md/docs/frontend/` | HTML / CSS / JavaScript DOM |
| 电气 | `md/docs/electron/` | C51 单片机（含 PPT 例题） |
| 硬件 | `md/docs/hardware/` | OpenMV / STM32 |
| 数据 | `md/docs/data/` | 各种数据格式（JSON/SQL/YAML…） |
| 其他 | `md/docs/other/` | 杂项笔记 |
| 代码 | `md/docs/code/` | 网页特效 |
| Skills | `md/docs/skills/` | Agent Skill 文档 |

新文档放入 `md/docs/<领域>/xxx.md`，在 `.Cdocs/config/route/docs.json` 对应分组登记即可出现在侧边栏。

## 部署

- **GitHub Pages**：push 到 main 后 Actions 自动构建发布（`.github/workflows/deploy.yml`，用仓库内 `Cdocs-linux` 直接构建，无需云端编译）。
- **Vercel**：导入本仓库即自动使用 `vercel.json` 构建（Root Directory 保持根目录）。

> `Cdocs-linux` 由 Cdocs 主仓库的 Build Linux Binary 工作流维护，引擎升级后从主仓库同步最新二进制即可。

## License

MIT
