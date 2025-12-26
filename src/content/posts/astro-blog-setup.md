---
title: "使用 Astro 搭建个人博客"
date: 2024-12-23
category: tech
tags: ["Astro", "Tailwind", "博客搭建"]
description: "详细介绍如何使用 Astro 5.x 和 Tailwind CSS 4.x 搭建一个现代化的个人博客。"
---

## 前言

在这篇文章中，我将分享如何使用 Astro 搭建这个博客的完整过程。

## 技术栈选择

- **Astro 5.x** - 静态站点生成器
- **Tailwind CSS 4.x** - 原子化 CSS 框架
- **霞鹜文楷** - 优雅的中文字体

## 项目结构

```
src/
├── components/   # 可复用组件
├── layouts/      # 页面布局
├── pages/        # 路由页面
├── content/      # 内容集合
└── styles/       # 全局样式
```

## 核心功能

### 内容集合

Astro 的 Content Collections 提供了类型安全的内容管理：

```typescript
const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});
```

### SEO 优化

- 自动生成 sitemap
- Open Graph 标签
- RSS 订阅支持

## 总结

Astro 是搭建内容型网站的绝佳选择，推荐给所有想要搭建个人博客的朋友。
