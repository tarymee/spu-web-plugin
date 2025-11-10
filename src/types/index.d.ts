// import type { App } from 'vue'
// import type { AxiosInstance } from 'axios'
declare global {
  interface Window {
    // 高德地图
    AMapLoader: any
    _AMapSecurityConfig: {
      securityJsCode: string
    }
    AMap: any
    AMapUI: any
    // 百度地图
    BMap: any
    BMAP_ANCHOR_TOP_LEFT: any
    BMAP_ANCHOR_TOP_RIGHT: any
    BMAP_ANCHOR_BOTTOM_LEFT: any
    BMAP_ANCHOR_BOTTOM_RIGHT: any
    BMAP_INITIAL_CALLBACK: any
    // 腾讯地图
    TMap: any
  }
}

interface IAMapLoader {
  load: (options?: {
    plugins?: Array<string>
    AMapUI?: {
      plugins?: Array<string>
    }
  }) => Promise<any>
}

interface IMapService {
  init: () => Promise<void>
  type: 'amap' | 'tencent' | 'baidu'
  AMap: any
  BMap: any
  TMap: any
}

type StorageType = 'storage' | 'storage-1d' | 'storage-3m' | 'storage-1y'

type Cope = { width?: number; height?: number } | string | boolean

interface IDownload {
  type?: 'att' | 'img'
  source: string
  datetime: string | number
  storagetype?: StorageType
  cope?: Cope
  filename?: string // 下载文件名
}

interface IDownloadService {
  getUrl: (options: IDownload) => Promise<any>
  downloadFile: (options: IDownload) => Promise<any>
}

interface IUpload {
  type?: 'att' | 'img'
  file: File
  source?: string
  datetime?: string | number
  storagetype?: StorageType
  onprogress?: (p: number, _checkpoint?: any) => void
}

interface ICopy {
  copykey: string
  storagetype?: StorageType
}

interface IUploadService {
  upload: (options: IUpload) => Promise<any>
  copy: (options: ICopy) => Promise<any>
}

// interface ISPUWebPluginOptions {
//   modulekey: string
//   modulename: string
//   moduleversion: string
//   storageproxyprefix?: string
//   isfixapptokenexpired?: boolean
//   router?: any
// }

interface ISPUWebPlugin {
  // install (app: App, option: ISPUWebPluginOptions): void
  install(app: any, option: any): void
  // install: any
  version: string
}

declare const SPUWebPlugin: ISPUWebPlugin

export default SPUWebPlugin

export const globalOptions: any
export const lsProxy: any
export const ssProxy: any
export const getLocation: (isuseiplocation?: boolean) => Promise<{
  longitude: string
  latitude: string
  address: string
  [propName: string]: any
} | null>
export const getDistance: (p1: [number, number], p2: [number, number]) => Promise<any>
export const getAddress: (location: {
  longitude: string
  latitude: string
  [propName: string]: any
}) => Promise<string>
export const spuAxios: any
export const apaasAxios: any
export const axios: any
export const decryptAxiosResponseData: any
export const spuConfig: any
export const globalConfig: any
export const downloadService: IDownloadService
export const uploadService: IUploadService
export const getServToken: () => Promise<{
  accesskeyid: string
  accesskeysecret: string
  securitytoken: string
  expiration: string
}>
export const getCloudServ: (type?: StorageType) => any
export const getUniqueid: () => string
export const getUuid: () => string
export const functionCheck: (functioncode?: string) => boolean
export const getServerTime: () => Promise<string>
export const encrypt: (str: string) => string
export const decrypt: (str: string) => string
export const setTitle: (pagetitle?: string) => void
export const isInApp: () => boolean
export const AMapLoader: IAMapLoader
export const mapService: IMapService
export const singleLogin: any
export const updateToken: () => Promise<void>
export const getToken: () => string
export const getTokenExpires: () => string
export const getRefreshToken: () => string
export const setToken: (value: string) => void
export const setTokenExpires: (value: string) => void
export const setRefreshToken: (value: string) => void
export const getUser: (key?: string) => any
export const checkLogin: () => boolean
export const Module: any
export const components: any
export const expandexp: (options: any) => void
export const wxworkSuite: any
export const isdebugger: () => boolean
export const isvirtuallocation: () => boolean
