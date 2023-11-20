
# spuConfig
`SPU` 模块配置信息相关服务。

## spuConfig.get()
+ 类型：

```js
function get (key: string | null): object | object[] | null
```

获取当前 `SPU` 模块的配置信息，如果有传 `key` 值则返回对应 `key` 的信息，如果没传则返回所有。

例子：
```js
import { spuConfig } from '@smart100/spu-web-plugin'

// 获取所有配置项
const allSpuConfig = spuConfig.get()
console.log(allSpuConfig)

// 获取单个配置项
const purposeConfig = spuConfig.get('customervisit.purpose')
console.log(purposeConfig)
```
