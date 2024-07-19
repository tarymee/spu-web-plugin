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
