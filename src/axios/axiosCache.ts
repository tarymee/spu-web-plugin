import localforage from 'localforage'
import type { AxiosRequestConfig, AxiosInstance } from 'axios'
import { isOnline } from '../utils'
import { getUser } from '../auth/login'

const store = localforage.createInstance({
  name: 'spu-db',
  storeName: 'axios-cache'
})

const defaultCachetime = 60 * 1000 * 60 * 24 * 7 // 默认缓存7天

// 将数据转换成indexDB能够保存的格式
// structuredClone 不支持的格式全部转成null
// Error 类型保留
const transform2IndexDB = (data: any, reverse = false): any => {
  if (!reverse) {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return data.map(transform2IndexDB)
    } else if (Object.prototype.toString.call(data) === '[object Object]') {
      return Object.fromEntries(
        new Map(
          Object.entries(data).map((item) => {
            return [item[0], transform2IndexDB(item[1])]
          })
        )
      )
    } else if (Object.prototype.toString.call(data) === '[object Error]') {
      return {
        __error__: true,
        name: data.name,
        message: data.message,
        stack: data.stack,
        // 保留其他自定义属性
        ...Object.fromEntries(
          Object.getOwnPropertyNames(data)
            .filter((prop) => !['name', 'message', 'stack'].includes(prop))
            .map((prop) => [prop, transform2IndexDB(data[prop])])
        )
      }
    } else {
      // 不支持的类型不报错 转换为null
      try {
        return structuredClone(data)
        // return data
      } catch (err) {
        // console.error(err)
        return null
      }
    }
  } else {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return data.map((item: any) => {
        return transform2IndexDB(item, true)
      })
    } else if (Object.prototype.toString.call(data) === '[object Object]') {
      if (data.__error__) {
        const error: any = new Error(data.message)
        error.name = data.name
        error.stack = data.stack

        // 恢复其他自定义属性
        Object.keys(data).forEach((key) => {
          if (!['__error__', 'name', 'message', 'stack'].includes(key)) {
            error[key] = transform2IndexDB(data[key], true)
          }
        })

        return error
      } else {
        return Object.fromEntries(
          new Map(
            Object.entries(data).map((item) => {
              return [item[0], transform2IndexDB(item[1], true)]
            })
          )
        )
      }
    } else {
      // 不支持的类型不报错 转换为null
      try {
        return structuredClone(data)
        // return data
      } catch (err) {
        // console.error(err)
        return null
      }
    }
  }
}

// window.addEventListener('online', () => {
//   console.log('浏览器已恢复在线')
// })

// window.addEventListener('offline', () => {
//   console.log('浏览器已离线')
//   console.log('当前处于离线状态，部分功能受限，恢复联网后将自动同步数据')
// })

// 生成缓存键 缓存区分租户和人员
const generateCacheKey = (axiosRequestConfig: AxiosRequestConfig): string => {
  const tenantcode = getUser('tenantcode') || ''
  const mbcode = getUser('mbcode') || getUser('membercode') || ''
  const baseURL = axiosRequestConfig?.baseURL || ''
  const url = axiosRequestConfig?.url || ''
  const method = axiosRequestConfig?.method || 'get'
  const params = JSON.stringify(axiosRequestConfig?.params || {})
  const data = JSON.stringify(axiosRequestConfig?.data || {})

  return `tenantcode=${tenantcode}&mbcode=${mbcode}&baseURL=${baseURL}&url=${url}&method=${method}&params=${params}&data=${data}`
}

interface IAxiosCacheConfig {
  // 缓存策略 cachestrategy：
  // network-only: 不缓存：仅使用联网数据
  // network-first: 网络优先，缓存数据后，下次请求优先使用联网数据，离线才使用缓存数据
  // cache-first: 缓存优先，缓存数据后，下次请求优先使用缓存数据，使用缓存后如果有联网则依然请求最新数据替换旧缓存【比如剑哥需求文档中的表单协议缓存，则属于此策略】【这个策略下需第二次请求接口才能拿到最新数据】
  // d.如果是 b c，支持配置缓存过期时间
  strategy: 'network-only' | 'cache-first' | 'network-first' | 'default'
  checkcachesave?: any
  cachetime?: number
}

interface IAxiosCacheData {
  success: boolean
  response: any
  cachetime: number // 缓存过期时间
  expiretime: number // 过期时间
}

const removeCache = async (cachekey: string) => {
  await store.removeItem(cachekey)
}

const setCache = async (cachekey: string, cache: IAxiosCacheData) => {
  await store.setItem(cachekey, transform2IndexDB(cache))
}

const getCache = async (cachekey: string) => {
  const cacheSource: IAxiosCacheData | null = await store.getItem(cachekey)
  const cache: IAxiosCacheData | null = transform2IndexDB(cacheSource, true)
  let isusecache = false
  if (cache && Date.now() <= cache.expiretime) {
    isusecache = true
  } else if (cache && Date.now() > cache.expiretime) {
    isusecache = false
    // 获取缓存时发现数据过期顺便清掉
    await removeCache(cachekey)
  } else {
    isusecache = false
  }
  return isusecache ? cache : null
}

const cacheToAxiosResponse = async (cache: IAxiosCacheData): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (cache.success) {
      return resolve(cache.response)
    } else {
      return reject(cache.response)
    }
  })
}

const axiosPromiseToCache = async (
  axiosPro: Promise<any>,
  config: IAxiosCacheConfig | null,
  cachekey: string
): Promise<IAxiosCacheData> => {
  return new Promise((resolve, reject) => {
    const realCachetime = Number(config?.cachetime || defaultCachetime)
    let success = false
    let response: any = null
    axiosPro
      .then(async (res: any) => {
        if (config?.checkcachesave) {
          success = await config.checkcachesave(res)
        }
        response = res
      })
      .catch(async (err: any) => {
        success = false
        response = err
      })
      .finally(() => {
        const cache = {
          cachetime: realCachetime,
          expiretime: Date.now() + realCachetime,
          success,
          response
        }
        if (success) {
          setCache(cachekey, cache)
        }
        resolve(cache)
      })
  })
}

const axiosCache = async (
  config: IAxiosCacheConfig | null,
  axiosInstance: AxiosInstance,
  axiosRequestConfig: AxiosRequestConfig
) => {
  // 检查是否启用缓存
  const cachekey = generateCacheKey(axiosRequestConfig)
  const strategy = config?.strategy || 'default'
  if (strategy) {
    // 暂不用这么多模式 默认 network-first 即可
    if (strategy === 'default' || strategy === 'network-first') {
      const online = await isOnline()
      if (online) {
        const cache = await axiosPromiseToCache(axiosInstance(axiosRequestConfig), config, cachekey)
        // debugger
        return cacheToAxiosResponse(cache)
      } else {
        const cache = await getCache(cachekey)
        // debugger
        if (cache) {
          return cacheToAxiosResponse(cache)
        } else {
          // debugger
          return new Error('no cache and offline')
        }
      }
    } else if (strategy === 'network-only') {
      return axiosInstance(axiosRequestConfig)
    } else if (strategy === 'cache-first') {
      console.error(`暂不支持该 ${strategy} 模式`)
      // const cache = await getCache(cachekey)
      // const online = await isOnline()
      // const getAndSetCacheIfOnline = async (): Promise<any> => {
      //   if (online) {
      //     const cache = await axiosPromiseToCache(
      //       axiosInstance(axiosRequestConfig),
      //       config,
      //       cachekey
      //     )
      //     return cache
      //   } else {
      //     return null
      //   }
      // }
      // if (cache) {
      //   getAndSetCacheIfOnline() // 这里不等返回 是优先使用缓存 但依然在线获取最新数据
      //   // debugger
      //   return cacheToAxiosResponse(cache)
      // } else {
      //   if (online) {
      //     const cache = await getAndSetCacheIfOnline()
      //     // debugger
      //     return cacheToAxiosResponse(cache)
      //   } else {
      //     return new Error('no cache and offline')
      //   }
      // }
    }
  } else {
    console.error(`暂不支持该 ${strategy} 模式`)
  }
}

const removeExpireDataByCachekey = async (cachekey: string) => {
  const cacheSource: IAxiosCacheData | null = await store.getItem(cachekey)
  if (cacheSource && Date.now() > cacheSource.expiretime) {
    await removeCache(cachekey)
  }
}

// 清除过期无效数据
const removeExpireData = async () => {
  store
    .keys()
    .then(async (keys) => {
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i]
        await removeExpireDataByCachekey(key)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const installAxiosCache = () => {
  removeExpireData()
}

export { axiosCache, installAxiosCache }
