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








