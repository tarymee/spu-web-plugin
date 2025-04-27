## spuConfig

`SPU` 模块配置信息相关服务。

### spuConfig.get()

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

## globalConfig

当前租户全局配置。

### globalConfig.get()

获取当前租户的全局配置信息，如果有传 `key` 值则返回对应 `key` 的信息，如果没传则返回所有。

- 类型：

```js
function get (key?: string | string[]): Promise<object | object[] | null>
```

- 示例：

```js
import { globalConfig } from '@smart100/spu-web-plugin'

// 获取所有配置项
const allSpuConfig = await globalConfig.get()
console.log(allSpuConfig)

// 获取单个配置项
const aiswitchRes = await globalConfig.get('aiswitch')
console.log(aiswitchRes)
const aiswitch = JSON.parse(aiswitchRes.configjson).onoff === '1' // AI 全局开关是否开启

// 获取多个配置项
const mulConfig = await globalConfig.get(['aiswitch', 'AIAccount'])
console.log(mulConfig)
```
