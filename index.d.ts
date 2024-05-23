// import type { App } from 'vue'
// import type { AxiosInstance } from 'axios'

interface ISPUWebPluginOptions {
  modulekey: string
  modulename: string
  moduleversion: string
  router?: any
}

interface IAMapLoader {
  load: (options?: {
    plugins?: Array<string>
    AMapUI?: {
      plugins?: Array<string>
    }
  }) => Promise<any>
}

type StorageType = 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y'

type Cope = { width?: number, height?: number } | string | boolean

interface IDownload {
  type?: 'att' | 'img',
  source: string,
  datetime: string | number,
  storagetype?: StorageType,
  cope?: Cope
}

interface IDownloadService {
  getUrl: ({
    type = 'img',
    source = '',
    datetime = '',
    storagetype = 'storage',
    cope = ''
  }: IDownload) => Promise<any>
}


interface IUpload {
  type?: 'att' | 'img',
  file: File,
  source?: string,
  datetime?: string | number,
  storagetype?: StorageType,
  onprogress?: (p: number, _checkpoint?: any) => void
}

interface IUploadService {
  upload: ({
    type = 'img',
    file,
    source = '',
    datetime = '',
    storagetype = 'storage',
    onprogress,
  }: IUpload) => Promise<any>
}


type Location = {
  longitude: string
  latitude: string
  address: string
  [propName: string]: any
} | null


export const lsProxy: any
export const ssProxy: any
export const getLocation: () => Promise<Location>
export const getDistance: (p1: [number, number], p2: [number, number]) => Promise<any>
export const spuAxios: any
// export const spuAxios: AxiosInstance
export const apaasAxios: any
export const spuConfig: any
export const downloadService: IDownloadService
export const uploadService: IUploadService
export const getUniqueid: () => string
export const getUuid: () => string
export const functionCheck: (functioncode?: string) => boolean
export const AMapLoader: IAMapLoader
export const getToken: () => string
export const getTokenExpires: () => string
export const getRefreshToken: () => string
export const getUser: (key?: string) => any
export const checkLogin: () => boolean
export const Module: any
export const components: any
export const expandexp: () => void

interface ISPUWebPlugin {
  // install (app: App, option: ISPUWebPluginOptions): void
  install (app: any, option: ISPUWebPluginOptions): void
  // install: any
  version: string
}
declare const SPUWebPlugin: ISPUWebPlugin
export default SPUWebPlugin
