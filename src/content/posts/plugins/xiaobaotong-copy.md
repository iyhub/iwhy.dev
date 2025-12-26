---
title: "油猴脚本-小报童内容复制插件"
date: 2024-02-23
category: tech
tags: ["油猴脚本", "Chrome插件"]
description: "油猴脚本-小报童内容复制插件"
---

![Snipaste_20240222_231025.png](https://shanhai-blog.oss-cn-shanghai.aliyuncs.com/blog/Snipaste_2024-02-22_23-10-25_1708614648401.png)

## 添加脚本参考 [GPT导出插件](https://www.bettery.top/archives/chatgpt-export)
## 代码
```js
// ==UserScript==
// @name         小报童Copy-able
// @namespace    http://tampermonkey.net/
// @version      2024-02-19
// @description  try to take over the world!
// @author       zy
// @match        https://xiaobot.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaobot.net
// @grant        none
// ==/UserScript==

(function() {
    /**
    @author: zy
    @email:simpleyoung1@outlook.com
    **/
    'use strict';

    function enableTextSelection() {
        var elements = document.querySelectorAll('.post, .post_page, .forbidd');
        elements.forEach(function(element) {
            element.style.userSelect = 'text';
        });
    }

    function createEnableButton() {
        var button = document.createElement('button');
        button.textContent = 'Enable Text Selection';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.addEventListener('click', enableTextSelection);
        document.body.appendChild(button);
    }

    createEnableButton();
})();

```