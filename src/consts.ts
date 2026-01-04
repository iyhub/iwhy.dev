// 站点全局配置
export const SITE_TITLE = 'iWhy Blog';
export const SITE_DESCRIPTION = '阿歪的技术分享与生活随笔';
export const SITE_AUTHOR = 'Ethan Zhu';

import type { Repo, Mapping, BooleanString, InputPosition, Loading } from '@giscus/react';

// 产品展示
export interface Product {
    name: string;
    description: string;
    url: string;
    icon?: string; // phosphor icon name: BookOpen, Star, Camera, etc.
}

export interface CommentConfig {
    repo: Repo;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: Mapping;
    reactionsEnabled: BooleanString;
    emitMetadata: BooleanString;
    inputPosition: InputPosition;
    lang: string;
    loading: Loading;
}


export const PRODUCTS: Product[] = [
    {
        name: 'SwipeReady',
        description: 'AI Dating Photo Generator | Get 3x More Matches.',
        url: 'https://swipeready.net/',
        icon: 'PhImage',
    },
    {
        name: '个人名片生成器',
        description: '生成精美的个人名片',
        url: 'https://introcard.iwhy.dev',
        icon: 'PhBookOpen',
    },
    {
        name: '鸡汤卡片生成器',
        description: '生成精美的鸡汤语录卡片',
        url: 'https://retro.iwhy.dev/',
        icon: 'PhSparkle',
    },
    {
        name: '截图美化工具',
        description: '让你的截图更好看',
        url: 'https://pretty-snap.iwhy.dev/',
        icon: 'PhCamera',
    },
    {
        name: '公众号封面生成工具',
        description: '快速生成公众号封面图',
        url: 'https://cover.iwhy.dev/',
        icon: 'PhImage',
    },
    {
        name: 'GPT Detect',
        description: 'AI Content Detector',
        url: 'https://gptdetect.ai/',
        icon: 'PhMagnifyingGlass',
    },
    {
        name: 'Picool AI',
        description: 'AI 图片处理工具',
        url: 'https://picool.ai/',
        icon: 'PhMagicWand',
    },
    {
        name: 'AI Image To Image',
        description: 'AI 图生图工具',
        url: 'https://imagetoimage.app/',
        icon: 'PhArrowsLeftRight',
    },
    {
        name: 'Temp Mail',
        description: '临时邮箱服务',
        url: 'https://tempmailpro.org/',
        icon: 'PhEnvelope',
    },
    {
        name: 'Image Splitter',
        description: '图片分割工具',
        url: 'https://imagesplitter.org/',
        icon: 'PhGridFour',
    },
    {
        name: 'Nova Tools',
        description: 'AI 工具集合',
        url: 'https://novatools.ai/',
        icon: 'PhWrench',
    },
    {
        name: 'Submito',
        description: '提交你的工具到 Submito',
        url: 'https://submito.net/',
        icon: 'PhPaperPlaneTilt',
    },
];

export const COMMENT_CONFIG: CommentConfig = {
    repo: 'iyhub/iwhy.dev',
    repoId: 'R_kgDOQuXySw',
    category: 'Announcements',
    categoryId: 'DIC_kwDOQuXyS84C0jgj',
    mapping: 'title',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'top',
    lang: 'zh-CN',
    loading: 'lazy',
};
