---
title: "终端效率提升指南"
date: 2024-12-08
category: "技术"
tags: ["终端", "效率", "工具"]
description: "分享一些提升终端使用效率的技巧和工具配置。"
---

## Shell 选择

### Zsh + Oh My Zsh

Zsh 配合 Oh My Zsh 是目前最流行的组合，提供了丰富的插件和主题。

推荐插件：

- `zsh-autosuggestions`：命令自动补全
- `zsh-syntax-highlighting`：语法高亮
- `z`：快速跳转目录

### Fish Shell

如果喜欢开箱即用的体验，Fish 是个不错的选择，自带语法高亮和智能补全。

## 终端模拟器

### Warp

现代化的终端，内置 AI 助手，块编辑功能很实用。

### iTerm2

macOS 上的经典选择，功能丰富，高度可定制。

### Alacritty

GPU 加速的终端，速度极快，适合追求性能的用户。

## 常用工具

### fzf

模糊搜索工具，可以快速搜索历史命令、文件等。

### ripgrep (rg)

比 grep 更快的搜索工具，支持 .gitignore。

### bat

更好的 cat，支持语法高亮和 Git 集成。

### eza

ls 的现代替代品，彩色输出，支持图标。

## 配置建议

```bash
# 常用别名
alias ll='eza -la'
alias g='git'
alias c='code .'
```

## 总结

投入时间配置好终端环境，长期来看会大大提升工作效率。
