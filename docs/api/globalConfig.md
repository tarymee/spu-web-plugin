# globalConfig

用于获取和保存`【产品配置中心-基础设置-系统设置】`下的系统设置项。

## globalConfig.get()

获取系统设置，如果有传 `key` 值则返回对应 `key` 的信息，如果没传则返回所有设置项。

- 类型：

```js
function get (key?: string | string[]): Promise<object | object[] | null>
```

- 示例：

```js
import { globalConfig } from '@smart100/spu-web-plugin'

// 获取所有配置项
const allConfig = await globalConfig.get()
console.log(allConfig)

// 获取单个配置项
const aiswitchRes = await globalConfig.get('aiswitch')
console.log(aiswitchRes)
const aiswitch = JSON.parse(aiswitchRes.configjson).onoff === '1' // AI 全局开关是否开启

// 获取多个配置项
const mulConfig = await globalConfig.get(['aiswitch', 'AIAccount'])
console.log(mulConfig)
```

## globalConfig.save()

未实现，敬请期待...
