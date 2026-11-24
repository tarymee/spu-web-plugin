# spuConfig

`SPU` 模块配置信息相关服务。

## spuConfig.get()

获取当前 `SPU` 模块的配置信息，如果有传 `dataid` 值则返回对应 `dataid` 的信息，如果没传则返回所有。

- 类型：

```js
function get (dataid?: string | string[]): Promise<object | object[] | null>
```

- 示例：

```js
import { spuConfig } from '@smart100/spu-web-plugin'

// 获取所有配置项
const allSpuConfig = await spuConfig.get()
console.log(allSpuConfig)

// 获取单个配置项
const singleConfig = await spuConfig.get('customervisit.purpose')
console.log(singleConfig)

// 获取多个配置项
const mulConfig = await spuConfig.get(['customervisit.purpose'])
console.log(mulConfig)
```

## spuConfig.save()

未实现，敬请期待...
