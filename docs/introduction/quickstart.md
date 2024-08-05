# 快速开始

通过本章节你可以了解到 `@smart100/spu-web-plugin` 的安装方法和基本使用姿势。

## 安装

安装依赖

```bash
npm install @smart100/spu-web-plugin
```

## 使用

当你使用 vue-cli 或 vite 初始化一个前端项目之后，在入口文件中安装该插件即可使用：

### vue3
```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SPUWebPlugin from '@smart100/spu-web-plugin'

function getModuleData () {
  // 基于部署路径查出 modulekey moduleversion
  const arr = location.pathname.split('/')
  return {
    modulename: 'xxxx',
    modulekey: arr[1],
    moduleversion: arr[2]
  }
}

const app = createApp(App)

app.use(SPUWebPlugin, {
  ...getModuleData(),
  router // 需要传入 router 实例以便做单点登录
})

app.use(router)
app.mount('#app')
```


### vue2
```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'

function getModuleData () {
  // 基于部署路径查出 modulekey moduleversion
  const arr = location.pathname.split('/')
  return {
    modulename: 'xxxx',
    modulekey: arr[1],
    moduleversion: arr[2]
  }
}

Vue.use(VueRouter)
Vue.use(SPUWebPlugin, {
  ...getModuleData(),
  router // 需要传入 router 实例以便做单点登录
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```
