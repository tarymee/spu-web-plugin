## functionCheck()

用于校验当前登录人是否拥有某个表单/功能点的权限。

- 类型：

```js
function functionCheck (functioncode?: string): boolean
```

- 示例：

```js
import { functionCheck } from '@smart100/spu-web-plugin'

const is = functionCheck('1429379220684842752')
console.log(is)
```

## setTitle()

设置当前页面标题。

除了设置 SPU 页面本身的标题之外，也同时会检测是否处于 SPU 容器内，是的话同样会设置 SPU 容器所处客户端（APP，H5 引擎，WEB 引擎）的标题。

- 类型：

```js
function setTitle (pagetitle?: string): void
```

- 示例：

```js
import { setTitle } from '@smart100/spu-web-plugin'

setTitle('标题')
```

## isInApp()

判断当前页面是否在智慧 100APP 内，分两种情况：

- 当前 SPU 页面正常通过智慧 100APP 中的 SPU 容器被打开
- 智慧 100APP 打开了 H5-SPU 的页面，然后再由 H5-SPU 的页面打开当前 SPU 页面（例：智慧 100APP - 工作台 - 客户管理 H5SPU 页面 - 客户详情 H5SPU 页面 - 点击开始拜访按钮 - 打开拜访步骤列表页）

- 类型：

```js
function isInApp (): boolean
```

- 示例：

```js
import { isInApp } from '@smart100/spu-web-plugin'

const isin = isInApp()
console.log(isin)
```

## getUuid()

生成并返回 `uuid`。

- 类型：

```js
function getUuid (): string
```

- 示例：

```js
import { getUuid } from '@smart100/spu-web-plugin'

const uuid = getUuid()
console.log(uuid)
```

## getUniqueid()

生成并返回唯一 `id`。

- 类型：

```js
function getUniqueid (): string
```

- 示例：

```js
import { getUniqueid } from '@smart100/spu-web-plugin'

const id = getUniqueid()
console.log(id)
```

## getServerTime()

获取服务器当前时间，返回时间戳字符串类型。

这个方法整合了 App 端 `Native-APi` 的 `Native.getServerTime()` 方法，如果 SPU 页面在 App 端且存在 `Native.getServerTime()` 方法，则使用 `Native.getServerTime()`，如果不存在会直接调用 `'/api/teapi/offline/servertime'` 接口获取服务器时间。

- 类型：

```js
function getServerTime (): Promise<string>
```

- 示例：

```js
import { getServerTime } from '@smart100/spu-web-plugin'

const timestamp = await getServerTime()
console.log(timestamp) // '1748412815918'
```