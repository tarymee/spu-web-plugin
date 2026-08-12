import localforage from 'localforage'
import type { IDownload } from './downloadService'
import type { IUpload } from './uploadService'
import { globalOptions } from '../index'

interface ICacheData {
  blob: Blob
  cachetime: number // 缓存过期时间
  expiretime: number // 过期时间
}

interface ICaches {
  [propName: string]: ICacheData
}

interface ICacheobj {
  key: string
  copekey: string
}

let defaultCachetime = 60 * 1000 * 60 * 2 // 默认缓存2小时

const store = localforage.createInstance({
  name: 'spu-db',
  storeName: 'oss-cache'
})

type Cope = { width?: number | string; height?: number | string } | string | boolean

const getCopeStr = (cope: Cope) => {
  let str = ''
  if (cope) {
    if (cope === true) {
      str = 'w_100,h_100'
    } else if (typeof cope === 'string') {
      str = cope
    } else if (cope.width || cope.height) {
      const width = String(cope.width || '').replace('px', '')
      const height = String(cope.height || '').replace('px', '')
      str = `w_${width},h_${height}`
    }
  } else {
    str = 'default'
  }
  return str
}

// 生成缓存键 缓存区分租户和人员
const generateCacheobj = ({
  type = 'img',
  source = '',
  datetime = '',
  storagetype = 'storage',
  cope = ''
}: IDownload): ICacheobj => {
  const copeStr = getCopeStr(cope)
  return {
    key: `type=${type}&storagetype=${storagetype}&source=${source}&datetime=${datetime}`,
    copekey: copeStr
  }
}

const getAllCachesBykey = async (key: string): Promise<ICaches | null> => {
  const allcaches: ICaches | null = await store.getItem(key)
  return allcaches || null
}

const setCache = async (cacheobj: ICacheobj, cache: ICacheData) => {
  let allcaches = await getAllCachesBykey(cacheobj.key)
  if (allcaches) {
    allcaches[cacheobj.copekey] = cache
  } else {
    allcaches = {
      [cacheobj.copekey]: cache
    }
  }
  await store.setItem(cacheobj.key, allcaches)
}

const setCacheByFile = (
  { type = 'img', file, source = '', datetime = '', storagetype = 'storage' }: IUpload,
  cachetime: number = defaultCachetime
) => {
  // 暂时只作用于图片
  if (type === 'img') {
    setCache(
      generateCacheobj({
        type,
        source,
        datetime,
        storagetype,
        cope: false
      }),
      {
        cachetime: cachetime,
        expiretime: Date.now() + cachetime,
        blob: new Blob([file], {
          type: file.type // 保留原 File 的 MIME 类型（如 image/png）
        })
      }
    )
  }
}

const isExpireData = (cache: ICacheData) => {
  if (Date.now() > cache.expiretime) {
    return true
  }
  // return true
  return false
}

const getCache = async (cacheobj: ICacheobj, whennomatchcopekeyreturnanyone: boolean = false) => {
  let allcaches = await getAllCachesBykey(cacheobj.key)
  let cache = null
  if (allcaches) {
    // 找出所有没过期的缓存
    const noExpireData: ICaches = {}
    for (const x in allcaches) {
      const item = allcaches[x]
      if (!isExpireData(item)) {
        noExpireData[x] = item
      }
    }

    cache = noExpireData[cacheobj.copekey] || null
    // 当没命中copekey时，返回默认缓存 默认缓存不存在时返回第一个缓存
    if (!cache && whennomatchcopekeyreturnanyone && Object.keys(noExpireData).length) {
      cache = noExpireData['default'] || noExpireData[Object.keys(noExpireData)[0]]
    }
  }
  return cache
}

const removeCache = async (cacheobj: ICacheobj) => {
  let allcaches = await getAllCachesBykey(cacheobj.key)
  if (allcaches && allcaches[cacheobj.copekey]) {
    delete allcaches[cacheobj.copekey]
    if (Object.keys(allcaches).length) {
      await store.setItem(cacheobj.key, allcaches)
    } else {
      await store.removeItem(cacheobj.key)
    }
  }
}

const removeExpireDataBykey = async (key: string) => {
  let allcaches = await getAllCachesBykey(key)
  if (allcaches) {
    for (const x in allcaches) {
      const cache: ICacheData | null = allcaches[x]
      if (cache && isExpireData(cache)) {
        delete allcaches[x]
      }
    }
    if (Object.keys(allcaches).length) {
      await store.setItem(key, allcaches)
    } else {
      await store.removeItem(key)
    }
  }
}

// 清除过期无效数据
const removeExpireData = async () => {
  store
    .keys()
    .then(async (keys) => {
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i]
        await removeExpireDataBykey(key)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

const installOssCache = () => {
  defaultCachetime = globalOptions?.osscache?.cachetime || defaultCachetime
  removeExpireData()
}

export { installOssCache }

export default {
  defaultCachetime,
  generateCacheobj,
  setCache,
  setCacheByFile,
  getCache,
  removeCache
}
