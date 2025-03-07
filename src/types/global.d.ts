interface IAny {
  [param: string]: any
}

type StorageType = 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y'

enum StorageEnum {
  Storage = 'storage',
  Storage1d = 'storage-1d',
  Storage3m = 'storage-3m',
  Storage1y = 'storage-1y'
}

interface NormalizedCloudServItem {
  cloudserv_storage_provider: string
  cloudserv_storage_storagebucket: string
  cloudserv_storage_storageendpoint: string
  cloudserv_storage_storageurl: string
  cloudserv_storage_accesskeyid?: string
  cloudserv_storage_region?: string
}

type NormalizedCloudServ = {
  [key in StorageEnum]?: NormalizedCloudServItem
}

interface IStorage {
  provider: string
  storagebucket: string
  storageendpoint: string
  storageurl: string
  accesskeyid: string
  region: string
}

type ICloudServ = {
  [key in StorageEnum]: IStorage
}

interface IProductVersion {
  code: string
  name: string
  productcode: string
}

interface ITenantInfo {
  accountcode: string
  code: string
  metatype: string
  name: string
  cloudserv: ICloudServ
  productversionlist: IProductVersion[]
}

interface Window {
  AWS: any
}

declare module 'uuid'
declare module 'co'
