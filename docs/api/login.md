## 单点登录
使用该插件时，需要传入 `router` 实例（基于 `vue-router` 创建），会自动开启单点登录服务。

当访问 `URL` 带有 `token` `tokenexpires` `refreshtoken` 参数时，插件会自行获取这些参数走单点登录流程，最后在 `URL` 上删除这些参数，并跳转目标页面。





## 自动刷新 token
使用该插件时，自动拥有该能力，插件会在 `token` 过期前15秒重新刷新 `token`，以保持持续登录状态。





## getToken()
获取当前 `token`。

+ 类型：

```js
function getToken (): string
```

+ 示例：

```js
import { getToken } from '@smart100/spu-web-plugin'
const token = getToken()
console.log(token)
```




## getTokenExpires()
获取当前 `tokenexpires`。

+ 类型：

```js
function getTokenExpires (): string
```

+ 示例：

```js
import { getTokenExpires } from '@smart100/spu-web-plugin'
const tokenexpires = getTokenExpires()
console.log(tokenexpires)
```




## getRefreshToken()
获取当前 `refreshtoken`。

+ 类型：

```js
function getRefreshToken (): string
```

+ 示例：

```js
import { getRefreshToken } from '@smart100/spu-web-plugin'
const refreshtoken = getRefreshToken()
console.log(refreshtoken)
```




## checkLogin()
获取当前环境是否已登录。

+ 类型：

```js
function checkLogin (): boolean
```

+ 示例：

```js
import { checkLogin } from '@smart100/spu-web-plugin'
const isLogin = checkLogin()
console.log(isLogin)
```


