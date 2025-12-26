// 站点全局配置
export const SITE_TITLE = 'iWhy Blog';
export const SITE_DESCRIPTION = '阿歪的技术分享与生活随笔';
export const SITE_AUTHOR = 'Cole';

// 产品展示
export interface Product {
    name: string;
    description: string;
    url: string;
    icon?: string;
}

export const PRODUCTS: Product[] = [
    {
        name: '示例产品 1',
        description: '这是一个示例产品的描述',
        url: 'https://example.com',
        icon: '🚀',
    },
    {
        name: '示例产品 2',
        description: '另一个示例产品',
        url: 'https://example.com',
        icon: '✨',
    },
    // 在这里添加你的产品...
];
