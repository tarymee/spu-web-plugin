## functionCheck()
用于校验当前登录人是否拥有某个表单/功能点的权限。

+ 类型：

```js
function functionCheck (functioncode?: string): boolean
```

+ 示例：

```js
import { functionCheck } from '@smart100/spu-web-plugin'

const is = functionCheck('1429379220684842752')
console.log(is)
```

## setTitle()
设置当前页面标题。

除了设置SPU页面本身的标题之外，也同时会检测是否处于SPU容器内，是的话同样会设置SPU容器所处客户端（APP，H5引擎，WEB引擎）的标题。

+ 类型：

```js
function setTitle (pagetitle?: string): void
```

+ 示例：

```js
import { setTitle } from '@smart100/spu-web-plugin'

setTitle('标题')
```

## isInApp()
判断当前页面是否在智慧100APP内，分两种情况：

+ 当前SPU页面正常通过智慧100APP中的SPU容器被打开
+ 智慧100APP打开了H5-SPU的页面，然后再由H5-SPU的页面打开当前SPU页面（例：智慧100APP - 工作台 - 客户管理H5SPU页面 - 客户详情H5SPU页面 - 点击开始拜访按钮 - 打开拜访步骤列表页）

+ 类型：

```js
function isInApp (): boolean
```

+ 示例：

```js
import { isInApp } from '@smart100/spu-web-plugin'

const isin = isInApp()
console.log(isin)
```


## getUuid()
生成并返回 `uuid`。

+ 类型：

```js
function getUuid (): string
```

+ 示例：

```js
import { getUuid } from '@smart100/spu-web-plugin'

const uuid = getUuid()
console.log(uuid)
```



## getUniqueid()
生成并返回唯一 `id`。

+ 类型：

```js
function getUniqueid (): string
```

+ 示例：

```js
import { getUniqueid } from '@smart100/spu-web-plugin'

const id = getUniqueid()
console.log(id)
```
