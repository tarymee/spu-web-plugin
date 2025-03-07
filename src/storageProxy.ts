let STORAGENAMESPACE = ''

class StorageProxy {
  constructor(StorageType: 'local' | 'session' = 'local') {
    this.provider = window[`${StorageType}Storage`]
  }

  provider

  getItem(key: string) {
    return this.provider.getItem(`${STORAGENAMESPACE ? STORAGENAMESPACE + '-' + key : key}`)
  }

  setItem(key: string, value: string) {
    return this.provider.setItem(`${STORAGENAMESPACE ? STORAGENAMESPACE + '-' + key : key}`, value)
  }

  removeItem(key: string) {
    return this.provider.removeItem(`${STORAGENAMESPACE ? STORAGENAMESPACE + '-' + key : key}`)
  }

  clear() {
    const namespaceKeys = []
    for (let i = 0, len = this.provider.length; i < len; i++) {
      const item: string | null = this.provider.key(i)
      if (item && item.indexOf(`${STORAGENAMESPACE}-`) === 0) {
        namespaceKeys.push(item)
      }
    }
    namespaceKeys.forEach((item) => {
      this.removeItem(item)
    })
  }
}

const lsProxy: StorageProxy = new StorageProxy('local')
const ssProxy: StorageProxy = new StorageProxy('session')

function initStorageProxy(options: any) {
  STORAGENAMESPACE = options.storageproxyprefix || options.modulekey
}

export { initStorageProxy, lsProxy, ssProxy }
