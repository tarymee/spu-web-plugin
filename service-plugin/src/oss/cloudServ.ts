import { globalOptions } from '../index'
import { StorageType } from '../types/types'

class CloudServ {
  cacheStorage: NormalizedCloudServ | null = null

  public get(key: StorageType = 'storage'): NormalizedCloudServItem | null {
    if (this.cacheStorage) {
      return this.cacheStorage[key] || null
    }

    const storage = globalOptions.getCloudserv()
    return storage[key]
  }

  public getProvider(sign: StorageType = 'storage'): any {
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
