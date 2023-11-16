# 快速开始

通过本章节你可以了解到 `@smart100/spu-web-plugin` 的安装方法和基本使用姿势。

## 安装

安装依赖

```bash
npm install @smart100/spu-web-plugin
```

## 使用

当你使用 vue-cli 或 vite 初始化一个前端项目之后，在入口文件中安装该插件即可使用：

```js
// main.js or main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SPUWebPlugin from '@smart100/spu-web-plugin'

const app = createApp(App)

app.use(SPUWebPlugin, {
  modulekey: 'demoSPU', // 实际使用时需要基于当前 SPU 页面链接查出 modulekey
  modulename: 'demoSPU',
  moduleversion: 'v1.0', // 实际使用时需要基于当前 SPU 页面链接查出 moduleversion
  router // 需要传入 router 实例以便做单点登录
})

app.use(router)
app.mount('#app')
```
