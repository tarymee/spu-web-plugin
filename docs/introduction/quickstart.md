# 快速开始

通过本章节你可以了解到 `@smart100/spu-web-plugin` 的安装方法和基本使用姿势。

## 安装

安装依赖

```bash
npm install @smart100/spu-web-plugin
```

## 使用

当你使用 `vue-cli` 或 `vite` 初始化一个前端项目之后，在入口文件中安装该插件即可使用：

### vue3 & SPU

如果是一个 `vue3 & SPU` 的前端项目，参考以下初始化代码。

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SPUWebPlugin from '@smart100/spu-web-plugin'

function getModuleData() {
  // 基于部署路径查出 modulekey moduleversion
  const arr = location.pathname.split('/')
  return {
    modulename: '', // 填 spu 名称，例如：超级表单SPU
    modulekey: arr[1],
    moduleversion: arr[2]
  }
}

const app = createApp(App)

app.use(SPUWebPlugin, {
  ...getModuleData(),
  router, // 需要传入 router 实例以便做单点登录
  singleLoginCallback(res) { // 单点登录完成回调 如不需要可不传
    console.log(res)
  }
})

app.use(router)
app.mount('#app')
```

### vue2 & SPU

如果是一个 `vue2 & SPU` 的前端项目，参考以下初始化代码。

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'

function getModuleData() {
  // 基于部署路径查出 modulekey moduleversion
  const arr = location.pathname.split('/')
  return {
    modulename: '', // 填 spu 名称，例如：超级表单SPU
    modulekey: arr[1],
    moduleversion: arr[2]
  }
}

Vue.use(VueRouter)
Vue.use(SPUWebPlugin, {
  ...getModuleData(),
  router, // 需要传入 router 实例以便做单点登录
  singleLoginCallback(res) { // 单点登录完成回调 如不需要可不传
    console.log(res)
  }
})

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
```



### vue3 & 非 SPU

这是 `v1.0.32` 版本新增的功能，在这个版本以前，该插件仅支持在 `SPU` 前端项目中使用，这个版本新增支持在`非 SPU` 前端项目中使用。

注意：当在`非 SPU` 前端项目中使用时，`API` 中与 `SPU` 相关的服务均不可用，如：

- 接口请求服务的 `spuAxios`
- Module 相关服务
- 配置服务的 `spuConfig`
- ...

以下是初始化代码。

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SPUWebPlugin from '@smart100/spu-web-plugin'

const app = createApp(App)

// 非 SPU 项目初始化配置信息与 SPU 项目的区别：
// 需传递 isspu: false 标识这是非 SPU 项目
// 不需要传 modulename modulekey moduleversion
// 必须传入 storageproxyprefix 以作为 localStorage 命名空间前缀！（SPU 项目如果不传默认使用 modulekey 作为命名空间前缀）
app.use(SPUWebPlugin, {
  isspu: false,
  storageproxyprefix: 'xx', // 非 spu 项目必须传入 storageproxyprefix 以作为 localStorage 命名空间前缀！
  router, // 需要传入 router 实例以便做单点登录
  singleLoginCallback(res) { // 单点登录完成回调 如不需要可不传
    console.log(res)
  }
})

app.use(router)
app.mount('#app')
```