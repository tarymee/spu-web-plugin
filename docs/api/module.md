# Module 相关服务
提供了 `SPU` 模块相关的方法。





## checkModule()
检查当前租户是否安装了 `modulekey` 所对应的 `SPU`。

其实采用 Native-API: `window.Module.checkPermission(Object object)` 也能检查，但必须处于 `SPU 容器` 中才可采用这个方法，对于本地开发来说就不太方便了。

+ 类型：

```js
function checkModule (modulekey: string): Promise<boolean>
```

+ 示例：

```js
import { Module } from '@smart100/spu-web-plugin'
Module.checkModule('demospu').then((flag) => {
  console.log(flag)
})
```











## getEnvname()
获取当前企业环境名称。

+ 类型：

```js
function getEnvname (): Promise<string>
```

+ 示例：

```js
import { Module } from '@smart100/spu-web-plugin'
Module.getEnvname().then((envName) => {
  console.log(envName)
})
```






## getEnvData()
获取当前企业环境信息。

+ 类型：

```js
function getEnvData (): Promise<any>
```

+ 示例：

```js
import { Module } from '@smart100/spu-web-plugin'
Module.getEnvData().then((envData) => {
  console.log(envData)
})
```








## getModuleData()
获取 `SPU` 模块信息，如果有传 `modulekey` 则返回对应 `modulekey` 的 `SPU` 信息，如果没传则返回当前 `SPU` 的模块信息。

+ 类型：

```js
function getModuleData (modulekey?: string): Promise<any>
```

+ 示例：

```js
import { Module } from '@smart100/spu-web-plugin'
Module.getModuleData().then((moduleData) => {
  console.log(moduleData)
})
```





## getSpuContainerType()
判断当前页面处于哪个 `SPU` 容器。

+ 类型：

```js
function getSpuContainerType (modulekey?: string): Promise<'h5' | 'web' | 'app' | 'smartcenter' | 'smartconfigurationcenter' | ''>
```

+ 示例：

```js
import { Module } from '@smart100/spu-web-plugin'
Module.getSpuContainerType().then((type) => {
  console.log(type)
})
```
