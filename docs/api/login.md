## 单点登录

使用该插件时，需要传入 `router` 实例（基于 `vue-router` 创建），会自动开启单点登录服务。

当访问 `URL` 带有 `token` `tokenexpires` `refreshtoken` 参数时，插件会自行获取这些参数走单点登录流程，最后在 `URL` 上删除这些参数，并跳转目标页面。

## 自动刷新 token

使用该插件时，自动拥有该能力，插件会在合适的时机重新刷新 `token`，以保持持续登录状态。

## getToken()

获取当前 `token`。

- 类型：

```js
function getToken (): string
```

- 示例：

```js
import { getToken } from '@smart100/spu-web-plugin'
const token = getToken()
console.log(token)
```

## setToken()

设置当前 `token`。

- 类型：

```js
function setToken (value: string): void
```

- 示例：

```js
import { setToken } from '@smart100/spu-web-plugin'
setToken(
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjA0MDk0OTgsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxOTYzODM4MzI3ODI4NjU2MTI4IiwiYWNjb3VudENvZGUiOiIxOTYzODM4MzI4MTM0ODQwMzIwIiwidGVuYW50Q29kZSI6IjEwMDA5MzEiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDkzMSIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjoiYTZjYWFiYWUtYjY3My00MDUzLThlY2UtOTM4ODYzYTRkNTdiIiwib3JnQ29kZSI6IjEiLCJ1c2VySW5mb0lkIjoiMTk2MzgzODMyODMzNjE2NjkxMiIsInVzZXJJbmZvTmFtZSI6IueuoeeQhuWRmCIsInBvc2l0aW9uQ29kZSI6IjE5NjM4NTUyMzAwNzIzOTM3MjgiLCJwb3NpdGlvbk5hbWUiOiLns7vnu5_nrqHnkIblkZgt5Yu_5YigIiwibWVtYmVyQ29kZSI6IjE5NjM4NTUyNzQ4NjMzNjYxNDQiLCJyZWZQb3NpdGlvbkNvZGUiOiIxMzAwNzI4NjE0NTM0Mzg1NjY0IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMSIsInVzZXJOYW1lIjoiMTAwMDkzMSIsInVzZXJOYW1lMSI6IjEwMDA5MzEiLCJ1c2VyTmFtZTIiOm51bGwsInVzZXJOYW1lMyI6bnVsbCwidGVuYW50TmFtZSI6IuaZuuaFpzEwMFY5LjMuMS1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6InNhbGVzIiwiYXBwQ29kZXMiOlsicHJvbW90aW9uIiwiZGlzdHJpYnV0aW9uIiwic2FsZXMiXSwic3ViUGRDb2RlcyI6WyJzZmEiLCJkbXMiLCJwbW0iLCJ0cG0iLCJhaSJdLCJjb2RlcGF0aCI6IjEuIiwiaXNsZWFmb3JnIjoiZmFsc2UiLCJtZXRhbW9kZWx0eXBlIjoxLCJpc1Ntc0xvZ2luIjpmYWxzZX19.F-W23_LA8CthxH3NIjta5pS_gDNB4IKh-bHpgf0sjeM'
)
```

## getTokenExpires()

获取当前 `tokenexpires`。

- 类型：

```js
function getTokenExpires (): string
```

- 示例：

```js
import { getTokenExpires } from '@smart100/spu-web-plugin'
const tokenexpires = getTokenExpires()
console.log(tokenexpires)
```

## setTokenExpires()

设置当前 `tokenexpires`。

- 类型：

```js
function setTokenExpires (value: string): void
```

- 示例：

```js
import { setTokenExpires } from '@smart100/spu-web-plugin'
setTokenExpires('1760409498580')
```

## getRefreshToken()

获取当前 `refreshtoken`。

- 类型：

```js
function getRefreshToken (): string
```

- 示例：

```js
import { getRefreshToken } from '@smart100/spu-web-plugin'
const refreshtoken = getRefreshToken()
console.log(refreshtoken)
```

## setRefreshToken()

设置当前 `refreshtoken`。

- 类型：

```js
function setRefreshToken (value: string): void
```

- 示例：

```js
import { setRefreshToken } from '@smart100/spu-web-plugin'
setRefreshToken(
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NjA0MDk1OTgsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxOTYzODM4MzI3ODI4NjU2MTI4IiwiYWNjb3VudENvZGUiOiIxOTYzODM4MzI4MTM0ODQwMzIwIiwidGVuYW50Q29kZSI6IjEwMDA5MzEiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDkzMSIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjoiYTZjYWFiYWUtYjY3My00MDUzLThlY2UtOTM4ODYzYTRkNTdiIiwib3JnQ29kZSI6IjEiLCJ1c2VySW5mb0lkIjoiMTk2MzgzODMyODMzNjE2NjkxMiIsInVzZXJJbmZvTmFtZSI6IueuoeeQhuWRmCIsInBvc2l0aW9uQ29kZSI6IjE5NjM4NTUyMzAwNzIzOTM3MjgiLCJwb3NpdGlvbk5hbWUiOiLns7vnu5_nrqHnkIblkZgt5Yu_5YigIiwibWVtYmVyQ29kZSI6IjE5NjM4NTUyNzQ4NjMzNjYxNDQiLCJyZWZQb3NpdGlvbkNvZGUiOiIxMzAwNzI4NjE0NTM0Mzg1NjY0IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMSIsInVzZXJOYW1lIjoiMTAwMDkzMSIsInVzZXJOYW1lMSI6IjEwMDA5MzEiLCJ1c2VyTmFtZTIiOm51bGwsInVzZXJOYW1lMyI6bnVsbCwidGVuYW50TmFtZSI6IuaZuuaFpzEwMFY5LjMuMS1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6InNhbGVzIiwiYXBwQ29kZXMiOlsicHJvbW90aW9uIiwiZGlzdHJpYnV0aW9uIiwic2FsZXMiXSwic3ViUGRDb2RlcyI6WyJzZmEiLCJkbXMiLCJwbW0iLCJ0cG0iLCJhaSJdLCJjb2RlcGF0aCI6IjEuIiwiaXNsZWFmb3JnIjoiZmFsc2UiLCJtZXRhbW9kZWx0eXBlIjoxLCJpc1Ntc0xvZ2luIjpmYWxzZX19.lttA6Lu6n2TW7rqZo4C-gtqbVSxXTwvfSQM3e5Lor60'
)
```

## checkLogin()

检测当前环境是否已登录。

- 类型：

```js
function checkLogin (): boolean
```

- 示例：

```js
import { checkLogin } from '@smart100/spu-web-plugin'
const isLogin = checkLogin()
console.log(isLogin)
```

## singleLogin()

单点登录。

当使用该插件不传入 `router` 实例（基于 `vue-router` 创建）时，不会自动开启单点登录服务，那么需要在合适的时机自行接入单点登录服务。

- 类型：

```js
function singleLogin (query: object): Promise<{
  flag: boolean
  query: object
}>
```

- 示例：

```js
import { singleLogin } from '@smart100/spu-web-plugin'
import router from './router'

router.beforeEach(async (to: any, from: any, next: any) => {
  // 自动登录
  if (to.query.token) {
    const singleLoginRes = await login.singleLogin(to.query)
    if (singleLoginRes.flag) {
      // debugger
      // next()
      next({
        path: to.path,
        params: to.params,
        query: singleLoginRes.query
      })
    } else {
      console.error('单点登录失败，请检查链接所传 token 是否非法或过期。')
      next()
    }
  } else {
    next()
  }
})
```

## updateToken()

更新 `token`、`refreshtoken`、`tokenexpires`。

- 类型：

```js
function updateToken (): Promise<void>
```

- 示例：

```js
import { updateToken } from '@smart100/spu-web-plugin'
updateToken()
```
