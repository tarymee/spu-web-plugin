import { lsProxy } from './storageProxy'

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

  public remove () {
    lsProxy.removeItem(this.CLOUD_SERVE_KEY)
  }

  public getProvider (sign: StorageType = 'storage'): IAny | null {
    const storage: NormalizedCloudServItem | null = this.get(sign)
    if (!storage) {
      return null
    }
    const name = storage.cloudserv_storage_provider
    return {
      name: name,
      isAliyun: name === 'aliyun',
      isAzure: name === 'azure',
      isAwss3: name === 'awss3',
      isHuawei: name === 'huawei',
      isMinio: name === 'minio'
    }
  }
}

const cloudServ = new CloudServ()

export default cloudServ
