## spuAxios

插件对 `axios` 实例做了一层封装，专门用于请求 `SPU` 接口。

- 类型：

```js
const spuAxios: AxiosInstance
```

- 示例：

```js
import { spuAxios } from '@smart100/spu-web-plugin'

// 请求当前 SPU 内的接口，发起请求时会自动在 url 上拼接前缀：/api/modulekey/moduleversion
spuAxios
  .post(
    // 请求url
    '/customer/getCustomerInfo',
    // 请求参数
    {
      customerid: '123456'
    }
  )
  .then((res: any) => {
    console.log(res)
  })

// 支持传递额外配置项，可不传，不传采用默认值
// modulekey: 请求别的 SPU 接口，发起请求时会自动在 url 上拼接前缀：/api/modulekey/moduleversion
// isShowLoading: 发起请求时是否展示 loadding 弹窗，默认 true
// isSendToken: 发起请求时是否在 headers 传递 token，默认 true
spuAxios
  .post(
    // 请求url
    '/customer/getCustomerInfo',
    // 请求参数
    {
      customerid: '123456'
    },
    // 额外配置项
    {
      modulekey: 'system',
      isShowLoading: true,
      isSendToken: true
    }
  )
  .then((res: any) => {
    console.log(res)
  })
```

## axios

插件对 `axios` 实例做了一层封装，专门用于请求 `低码flycode` 或 `旧格式（比如平台接口）` 接口。

- 类型：

```js
const axios: AxiosInstance
```

- 示例：

```js
import { axios } from '@smart100/spu-web-plugin'

axios
  .post(
    // 请求url
    '/api/teapi/dy-biz/893405830819483679/1498533100018339939',
    // 请求参数
    {
      kx_kq_store: {
        id: '123456'
      }
    },
    // 额外配置项
    {
      isShowLoading: true,
      isSendToken: true
    }
  )
  .then((res: any) => {
    const customerInfo = res?.data?.kx_kq_store
    console.log(customerInfo)
  })
```

## 额外扩展
