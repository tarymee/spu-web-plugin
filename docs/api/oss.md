
## spuConfig

获取当前 `SPU` 模块的配置信息，如果有传 `key` 值则返回对应 `key` 的信息，如果没传则返回所有。

例子：
```js
import { spuConfig } from '@smart100/spu-web-plugin'
const allSpuConfig = spuConfig.get()
console.log(allSpuConfig)

const xx = spuConfig.get('xx')
console.log(xx)
```
