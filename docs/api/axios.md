## spuAxios
插件对 `axios` 实例做了一层封装，专门用于请求 `SPU` 接口。

+ 类型：

```js
const spuAxios: AxiosInstance
```

+ 示例：

```js
import { spuAxios } from '@smart100/spu-web-plugin'

spuAxios
  .post('/customer/getCustomerInfo', {
    customerid: '123456'
  })
  .then((res: any) => {
    console.log(res)
  })
```



## apaasAxios
插件对 `axios` 实例做了一层封装，专门用于请求 `低码flycode` 或 `旧格式（比如平台接口）` 接口。

+ 类型：

```js
const apaasAxios: AxiosInstance
```

+ 示例：

```js
import { apaasAxios } from '@smart100/spu-web-plugin'

apaasAxios
  .post('/api/teapi/dy-biz/893405830819483679/1498533100018339939', {
    kx_kq_store: {
      id: '123456'
    }
  })
  .then((res: any) => {
    const customerInfo = res?.data?.kx_kq_store
    console.log(customerInfo)
  })
```


## 额外扩展
