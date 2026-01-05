# iWhy Blog

一个基于 Astro 构建的现代化个人博客，注重性能、阅读体验和简洁设计。

**在线预览**: [iwhy.dev](https://iwhy.dev)

## 特性

- **高性能** - Lighthouse 100 分，默认零 JavaScript
- **暗黑模式** - 自动跟随系统或手动切换，偏好持久化
- **响应式设计** - 完美适配桌面、平板、手机
- **内容管理** - 基于 Astro Content Collections，类型安全
- **分类与标签** - 灵活的内容组织方式
- **周刊功能** - 定期发布精选内容
- **评论系统** - 集成 Giscus，基于 GitHub Discussions
- **SEO 优化** - 自动生成 Sitemap、RSS、OpenGraph
- **页面过渡** - View Transitions API 平滑动画
- **代码高亮** - 支持一键复制代码块
- **文章目录** - 自动生成侧边栏目录导航

## 技术栈

| 技术 | 说明 |
|------|------|
| [Astro](https://astro.build) | 静态站点生成框架 |
| [React](https://react.dev) | 交互组件 |
| [TypeScript](https://www.typescriptlang.org) | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com) | 原子化样式 |
| [MDX](https://mdxjs.com) | Markdown + JSX |
| [Giscus](https://giscus.app) | 评论系统 |

## 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/iwhy-blog.git
cd iwhy-blog

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 http://localhost:4321 查看效果。

### 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 本地预览构建结果 |

## 项目结构

```
src/
├── assets/            # 图片等静态资源
├── components/        # 组件
│   ├── Header.astro   # 导航栏
│   ├── Footer.astro   # 页脚
│   ├── PostCard.astro # 文章卡片
│   ├── Comment.tsx    # 评论组件
│   ├── TOC.astro      # 文章目录
│   └── ...
├── content/           # 内容集合
│   ├── posts/         # 文章 (Markdown/MDX)
│   ├── weekly/        # 周刊
│   └── categories/    # 分类定义
├── layouts/           # 布局模板
│   ├── BaseLayout.astro
│   └── PostLayout.astro
├── pages/             # 页面路由
│   ├── index.astro    # 首页
│   ├── about.astro    # 关于
│   ├── projects.astro # 项目展示
│   ├── posts/         # 文章列表与详情
│   ├── categories/    # 分类页
│   ├── tags/          # 标签页
│   └── weekly/        # 周刊页
├── styles/
│   └── global.css     # 全局样式
├── consts.ts          # 站点配置
└── content.config.ts  # 内容集合配置
```

## 配置

### 站点信息

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = '你的博客名称';
export const SITE_DESCRIPTION = '博客描述';
export const SITE_AUTHOR = '作者名';
```

### 评论系统

1. 在 [giscus.app](https://giscus.app) 配置你的仓库
2. 修改 `src/consts.ts` 中的 `COMMENT_CONFIG`：

```typescript
export const COMMENT_CONFIG = {
  repo: 'your-username/your-repo',
  repoId: 'your-repo-id',
  category: 'Announcements',
  categoryId: 'your-category-id',
};
```

### 域名配置

修改 `astro.config.mjs`：

```javascript
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

## 写作指南

### 创建文章

在 `src/content/posts/` 下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: '文章标题'
description: '文章描述'
pubDate: 2025-01-01
category: 'tech'
tags: ['tag1', 'tag2']
cover: './cover.png'  # 可选
draft: false          # 草稿不会发布
---

文章内容...
```

### 创建分类

在 `src/content/categories/` 下创建 JSON 文件：

```json
{
  "name": "分类名称",
  "description": "分类描述"
}
```

文件名即为分类 ID，在文章中通过 `category: 'filename'` 引用。

## 部署

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 自动检测 Astro 框架并部署

### Cloudflare Pages

```bash
pnpm build
```

上传 `dist/` 目录到 Cloudflare Pages。

### 自托管

```bash
pnpm build
# 将 dist/ 目录部署到任意静态服务器
```

## 自定义

### 样式定制

主题颜色定义在 `src/styles/global.css`：

```css
:root {
  --accent: #007AFF;      /* 主题色 */
  --black: rgb(28, 28, 30);
  --gray: rgb(142, 142, 147);
  /* ... */
}
```

### 字体

项目使用 [霞鹜文楷](https://github.com/lxgw/LxgwWenKai) 作为中文字体。

```css
/* global.css */
@import url("https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css");
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap");
```

## 致谢

- [Astro](https://astro.build) - 优秀的静态站点框架
- [霞鹜文楷](https://github.com/lxgw/LxgwWenKai) - 优雅的开源中文字体
- [Giscus](https://giscus.app) - 基于 GitHub Discussions 的评论系统

## 许可证

[MIT](./LICENSE)

---

如果这个项目对你有帮助，欢迎 Star 支持！
