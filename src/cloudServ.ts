import { lsProxy } from './storageProxy'

// let cacheStorage: NormalizedCloudServ | null = null

// const CLOUDSERVE = 'cloudserv'

// const set = (storage: NormalizedCloudServ | string) => {
//   if (typeof storage === 'object') {
//     cacheStorage = storage
//     storage = JSON.stringify(storage)
//   }
//   lsProxy.setItem(CLOUDSERVE, storage)
// }

// const get = (key: StorageType = 'storage'): NormalizedCloudServItem | null => {
//   if (cacheStorage) {
//     return cacheStorage[key as StorageType] || null
//   }
//   const storageStr = lsProxy.getItem(CLOUDSERVE)
//   if (!storageStr) {
//     return null
//   }
//   const storage = JSON.parse(storageStr)
//   cacheStorage = storage
//   return storage[key]
// }

// const getProvider = (sign: StorageType = 'storage') => {
//   const storage: NormalizedCloudServItem | null = get(sign)
//   if (!storage) {
//     return false
//   }
//   return storage.cloudserv_storage_provider
// }

// const isAliyun = (sign: StorageType = 'storage') => {
//   return getProvider(sign) === 'aliyun'
// }

// const isAzure = (sign: StorageType = 'storage') => {
//   return getProvider(sign) === 'azure'
// }

// const isAwss3 = (sign: StorageType = 'storage') => {
//   return getProvider(sign) === 'awss3'
// }

// const isHuawei = (sign: StorageType = 'storage') => {
//   return getProvider(sign) === 'huawei'
// }

// export default {
//   set,
//   get,
//   isAliyun,
//   isAzure,
//   isAwss3,
//   isHuawei
// }

class CloudServ {
  CLOUD_SERVE_KEY = 'cloudserv'

  cacheStorage: NormalizedCloudServ | null = null

  public get (key: StorageType = 'storage'): NormalizedCloudServItem | null {
    if (this.cacheStorage) {
      return this.cacheStorage[key] || null
    }
    const storageStr = lsProxy.getItem(this.CLOUD_SERVE_KEY)
    if (!storageStr) {
      return null
    }
    const storage = JSON.parse(storageStr)
    this.cacheStorage = storage
    return storage[key]
  }

  public set (storage: NormalizedCloudServ | string) {
    if (typeof storage === 'object') {
      this.cacheStorage = storage
      storage = JSON.stringify(storage)
    }
    lsProxy.setItem(this.CLOUD_SERVE_KEY, storage)
  }

  private getProvider (sign: StorageType = 'storage') {
    const storage: NormalizedCloudServItem | null = this.get(sign)
    if (!storage) {
      return false
    }
    return storage.cloudserv_storage_provider
  }


  public isAliyun (sign: StorageType = 'storage') {
    return this.getProvider(sign) === 'aliyun'
  }

  public isAzure (sign: StorageType = 'storage') {
    return this.getProvider(sign) === 'azure'
  }

  public isAwss3 (sign: StorageType = 'storage') {
    return this.getProvider(sign) === 'awss3'
  }

  public isHuawei (sign: StorageType = 'storage') {
    return this.getProvider(sign) === 'huawei'
  }
}

export default new CloudServ()








