
## getUser
+ 类型：

```js
function getUser (key: string | null): any
```

获取当前登录人信息，如果有传 `key` 值则返回对应 `key` 值的信息，如果没传则返回所有。

例子：
```js
import { getUser } from '@smart100/spu-web-plugin'
const user = getUser()
console.log(user)

const mbcode = getUser('mbcode')
console.log(mbcode)
```
