// import type { App } from 'vue'
// import type { AxiosInstance } from 'axios'

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
  cope?: Cope,
  filename?: string, // 下载文件名
}

interface IDownloadService {
  getUrl: (options: IDownload) => Promise<any>
  downloadFile: (options: IDownload) => Promise<any>
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
  upload: (options: IUpload) => Promise<any>
}

// interface ISPUWebPluginOptions {
//   modulekey: string
//   modulename: string
//   moduleversion: string
//   storageproxyprefix?: string
//   router?: any
// }


interface ISPUWebPlugin {
  // install (app: App, option: ISPUWebPluginOptions): void
  install (app: any, option: any): void
  // install: any
  version: string
}

declare const SPUWebPlugin: ISPUWebPlugin

export default SPUWebPlugin


export const globalOptions: any
export const lsProxy: any
export const ssProxy: any
export const getLocation: () => Promise<{
  longitude: string
  latitude: string
  address: string
  [propName: string]: any
} | null>
export const getDistance: (p1: [number, number], p2: [number, number]) => Promise<any>
export const spuAxios: any
export const apaasAxios: any
export const axios: any
export const spuConfig: any
export const globalConfig: any
export const downloadService: IDownloadService
export const uploadService: IUploadService
export const getUniqueid: () => string
export const getUuid: () => string
export const functionCheck: (functioncode?: string) => boolean
export const setTitle: (pagetitle?: string) => void
export const isInApp: () => boolean
export const AMapLoader: IAMapLoader
export const updateToken: () => Promise<void>
export const getToken: () => string
export const getTokenExpires: () => string
export const getRefreshToken: () => string
export const getUser: (key?: string) => any
export const checkLogin: () => boolean
export const singleLogin: any
export const startRefreshtoken: any
export const Module: any
export const components: any
export const expandexp: (options: any) => void
export const wxworkSuite: any
