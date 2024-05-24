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
