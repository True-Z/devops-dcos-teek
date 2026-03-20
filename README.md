# devops docs

[![VitePress](https://img.shields.io/badge/VitePress-1.6.4-646CFF?style=flat-square&logo=vitepress&logoColor=white)](https://vitepress.dev/)
[![Vue](https://img.shields.io/badge/Vue-3.5.22-42B883?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.8.1-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](./LICENCE.md)
[![Last Commit](https://img.shields.io/github/last-commit/True-Z/devops?style=flat-square)](https://github.com/True-Z/devops/commits)
[![Repo Size](https://img.shields.io/github/repo-size/True-Z/devops?style=flat-square)](https://github.com/True-Z/devops)

这是一个基于 `VitePress + vitepress-theme-teek` 的个人知识库项目，面向长期内容沉淀与结构化管理。

## 主要目的

- 沉淀编程、运维、构建、学习等领域的可复用知识。
- 通过统一文档结构降低维护成本，便于长期迭代。
- 让文档既可站内阅读，也可在仓库协作场景中高效维护。

## 主要功能

- `Markdown` 驱动的文档内容管理。
- 目录化知识组织（如 `00.目录.md`、`00.简介.md` 约定）。
- 自动侧边栏、归档/分类/标签/清单等聚合能力。
- 本地搜索与多维导航。
- 文档一致性检查脚本（`docs:check`）。
- 文档时间更新脚本（`docs:touch`）。

## 技术栈

- `VitePress`
- `vitepress-theme-teek`
- `Vue 3`
- `pnpm`

## 目录结构

```text
.
├─ .vitepress/        # 站点配置与主题扩展
├─ docs/              # 文档内容
├─ srciprt/           # 文档辅助脚本（检查、时间更新）
├─ AI-docs/           # docs 编写协作规则沉淀
└─ package.json
```

## 环境配置

建议环境：

- `Node.js` >= 20
- `pnpm` >= 10

安装依赖：

```bash
pnpm install
```

## 快速开始

本地开发：

```bash
pnpm docs:dev
```

构建站点：

```bash
pnpm docs:build
```

预览构建结果：

```bash
pnpm docs:preview
```

## 命令说明（package.json）

- `commit:mixin`：提交辅助命令，先更新时间（`docs:touch`），再 `git add .`，最后进入 `cz-git` 交互式提交。
- `prettier`：按仓库配置格式化文件。
- `docs:check`：检查 `docs` 文档一致性（frontmatter、permalink、链接等）。
- `docs:touch`：更新目标文档 `date` 字段（支持单文件、`--changed`、`--since`）。
- `docs:touch:last`：按最近提交范围回补文档 `date`。
- `docs:dev`：启动 VitePress 本地开发服务。
- `docs:build`：构建静态文档站点。
- `docs:preview`：预览构建后的站点。

## 文档维护约定

- 文档修改后建议执行：

```bash
pnpm docs:touch --changed
pnpm docs:check
```

- 若涉及站点结构或渲染行为调整，补充执行：

```bash
pnpm docs:build
```

- frontmatter 中以 `@` 开头的值（如 `@nsdk`）需使用引号包裹，避免 YAML 解析异常。

## 可继续补充的事项

- 贡献流程（PR 规范、提交规范样例）。
- 发布流程（GitHub Pages / CI 说明）。
- 文档模板（新模块创建模板、专题页模板）。
- 常见问题（构建失败、链接校验失败、frontmatter 错误排查）。
