## isdebugger 调试模式

vConsole 是一个轻量、可拓展、针对手机网页的前端开发者调试面板。

本地开发时，在链接上拼接 isdebugger=1，即可开启 vConsole 调试工具。

在 App 或 Web 引擎里面时，开启开发者模式（App 是长按底部版本号 10 秒，Web 是右上角菜单-开发者模式），也可开启。

注意：该功能仅在开发调试阶段时使用，不建议用于正式生产环境。

该参数会记录在 sessionStorage 里，仅在当前会话中生效。

插件也提供对应的 API 用于获取当前是否开启调试模式。

- 类型：

```js
function isdebugger (): boolean
```

- 示例：

```js
import { isdebugger } from '@smart100/spu-web-plugin'

const is = isdebugger()
console.log(is)
```

## isvirtuallocation 虚拟定位

本地开发调试时需要获取地理定位，但定位不了时，在链接上拼接 isvirtuallocation=1，即可开启虚拟定位。

注意：该功能仅在开发调试阶段时使用，不建议用于正式生产环境。

该参数会记录在 sessionStorage 里，仅在当前会话中生效。

插件也提供对应的 API 用于获取当前是否开启虚拟定位。

- 类型：

```js
function isvirtuallocation (): boolean
```

- 示例：

```js
import { isvirtuallocation } from '@smart100/spu-web-plugin'

const is = isvirtuallocation()
console.log(is)
```
