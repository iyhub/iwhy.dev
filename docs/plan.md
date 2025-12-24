# Plan - 方案层

> 本文档定义 **How**，明确技术实现方案，基于 intent.md 和 spec.md 制定。

## 版本
v0.0.1

---

## 1. 技术栈

### 核心框架
| 类别 | 选型 | 版本 | 选择理由 |
|------|------|------|----------|
| 框架 | Astro | 5.x | SSG 优先、性能优秀、对内容站点友好 |
| UI 框架 | - | - | 默认Astro组件 |
| 样式方案 | - | - | Tailwind + typography |
| 内容管理 | Astro Content Collections | - | 原生支持、类型安全 |

### 字体方案
| 用途 | 选型 | 备选方案 | 说明 |
|------|------|----------|------|
| 中文正文 | LXGW WenKai (霞鹜文楷) | 思源宋体 | 开源免费、文艺优雅、适合长文阅读 |
| 中文标题 | LXGW WenKai (霞鹜文楷) | - | 与正文一致，通过字重/大小区分层级 |
| 英文/数字 | 霞鹜文楷内置英文 | Crimson Pro | 风格统一 |
| 代码 | JetBrains Mono | Fira Code | 开源、等宽、连字支持、0/O 区分清晰 |
| 系统回退 | 楷体, STKaiti, serif | - | 无网络时的降级方案 |

**字体 CSS 示例：**
```css
:root {
  --font-body: 'LXGW WenKai', 楷体, STKaiti, serif;
  --font-code: 'JetBrains Mono', 'Fira Code', monospace;
}
```

**字体加载策略：**
- [x] 使用 `font-display: swap` 避免 FOIT
- [ ] 考虑字体子集化减少体积（仅加载常用汉字）
- [x] 优先使用 WOFF2 格式
- [x] 使用 CDN 托管（推荐：https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/）

### 开发工具
| 类别 | 选型 | 用途 |
|------|------|------|
| 包管理 | pnpm / npm | 依赖管理 |
| 代码检查 | ESLint | 代码质量 |
| 格式化 | Prettier | 代码风格 |
| 类型检查 | TypeScript | 类型安全 |

### 构建与部署
| 类别 | 选型 | 说明 |
|------|------|------|
| 构建工具 | Vite (Astro 内置) | 快速构建 |
| 部署平台 | Vercel / Netlify / Cloudflare Pages | 待定 |
| CI/CD | GitHub Actions | 自动化构建部署 |

---

## 2. 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    CDN / 边缘节点                        │
│                 (Vercel / Cloudflare)                   │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     静态资源                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  HTML    │  │   CSS    │  │   JS     │              │
│  │  Pages   │  │  Styles  │  │ Islands  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

### 目录结构

```
/
├── src/
│   ├── components/       # 可复用组件
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   └── TOC.astro
│   ├── layouts/          # 页面布局
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/            # 页面路由
│   │   ├── index.astro
│   │   ├── posts/
│   │   │   └── [...slug].astro
│   │   ├── categories/
│   │   │   └── [category].astro
│   │   └── tags/
│   │       └── [tag].astro
│   ├── content/          # 内容集合
│   │   ├── config.ts
│   │   └── posts/
│   │       └── *.md
│   ├── styles/           # 全局样式
│   └── utils/            # 工具函数
├── public/               # 静态资源
│   ├── images/
│   └── favicon.ico
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 3. 数据模型

### 文章 (Post)

```typescript
interface Post {
  // 来自 Frontmatter
  title: string;
  date: Date;
  category: string;
  tags?: string[];
  description?: string;
  draft?: boolean;
  cover?: string;

  // 自动生成
  slug: string;
  readingTime: number;  // 阅读时间（分钟）
  wordCount: number;    // 字数统计
}
```

### Content Collection Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

---

## 4. 接口设计

> 本项目为纯静态站点，无后端 API。以下为构建时数据查询接口。

### 内容查询 API（Astro Content Collections）

```typescript
// 获取所有已发布文章
const posts = await getCollection('posts', ({ data }) => {
  return data.draft !== true;
});

// 按日期排序
const sortedPosts = posts.sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);

// 按分类筛选
const techPosts = posts.filter(post => post.data.category === '技术');

// 按标签筛选
const astroPosts = posts.filter(post =>
  post.data.tags?.includes('Astro')
);
```

---

## 5. 部署方案

### 部署流程

```
代码推送 → GitHub Actions 触发 → 安装依赖 → 构建静态文件 → 部署到 CDN
```

### GitHub Actions 配置（示例）

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel/Netlify/CF Pages
        # 具体配置根据选择的平台
```


---

## 6. 开发计划

### Phase 1：基础搭建 ✅
- [x] 项目初始化
- [x] Tailwind + Typography 配置
- [x] 字体配置（霞鹜文楷 + JetBrains Mono）
- [x] 基础布局组件（BaseLayout, Header, Footer）
- [x] Content Collections 配置
- [x] 首页文章列表
- [x] 文章详情页
- [x] RSS 订阅
- [x] Sitemap 生成

### Phase 2：功能完善 ✅
- [x] 分类页面（/categories, /categories/[category]）
- [x] 标签页面（/tags, /tags/[tag]）
- [x] 导航菜单更新
- [x] SEO 优化（JSON-LD 结构化数据）
- [x] 响应式适配优化（720px, 480px 断点）

### Phase 3：优化上线
- [ ] 性能优化
- [ ] 部署配置
- [ ] 正式上线

---

## 更新日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2024-12-24 | v0.2.0 | Phase 2 完成：分类标签、SEO、响应式 |
| 2024-12-24 | v0.1.0 | Phase 1 完成：基础搭建 |
| YYYY-MM-DD | v0.0.1 | 初始版本 |
