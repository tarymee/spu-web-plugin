

# Storage 代理

代理 `localStorage` 和 `sessionStorage`，使用该 API 会在取值赋值时自动添加 `modulekey` 前缀，以便与其他前端项目区分。


## lsProxy
+ 类型：

```js
const lsProxy: Storage
```

代理 `localStorage`。

示例：
```js
import { lsProxy } from '@smart100/spu-web-plugin'
lsProxy.setItem('data', 'xxx') // 会在 localStorage 中设置 demospu-data = 'xxx'
lsProxy.getItem('data', 'xxx') // 会从 localStorage 中取 key 为 demospu-data 的值
```


## ssProxy
+ 类型：

```js
const ssProxy: Storage
```

代理 `sessionStorage`。

示例：
```js
import { ssProxy } from '@smart100/spu-web-plugin'
ssProxy.setItem('data', 'xxx') // 会在 sessionStorage 中设置 demospu-data = 'xxx'
ssProxy.getItem('data', 'xxx') // 会从 sessionStorage 中取 key 为 demospu-data 的值
```


## 其他

之前的项目一般是把这两个方法部署在 `window` 上以方便调用，如果想沿用之前的用法，则需要自行部署。

```js
import { lsProxy, ssProxy } from '@smart100/spu-web-plugin'
window.lsProxy = lsProxy
window.ssProxy = ssProxy
```

如果是 `ts` 项目则需要在全局类型声明文件中定义：

```js
interface Window {
  lsProxy: any
  ssProxy: any
}
```
