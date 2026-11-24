// import type { App } from 'vue'
// import type { AxiosInstance } from 'axios'
declare global {
  interface Window {
    // Native Module aPaaS 为 G3 SPU 容器注入的 Native-API
    Native: any
    Module: any
    aPaaS: any
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
    // 处于小程序环境
    wx: any
    __wxjs_environment: string
    WeixinJSBridge: any
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
  getUrl: (options: IDownload) => Promise<string>
  getBlob: (options: IDownload) => Promise<Blob | null>
  getFile: (options: IDownload) => Promise<File | null>
  getObjectURL: (options: IDownload) => Promise<string>
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

export interface IAxiosCacheConfig {
  // 缓存策略 cachestrategy：
  // network-only: 不缓存：仅使用联网数据
  // network-first: 网络优先，缓存数据后，下次请求优先使用联网数据，离线才使用缓存数据
  // cache-first: 缓存优先，缓存数据后，下次请求优先使用缓存数据，使用缓存后如果有联网则依然请求最新数据替换旧缓存【比如剑哥需求文档中的表单协议缓存，则属于此策略】【这个策略下需第二次请求接口才能拿到最新数据】
  // d.如果是 b c，支持配置缓存过期时间
  strategy: 'network-only' | 'cache-first' | 'network-first' | 'default'
  checkcachesave?: any
  cachetime?: number
}

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
export const normalAxios: any
export const spuAxios: any
export const apaasAxios: any
export const axios: any
export const decryptAxiosResponseData: any
export const spuConfig: any
export const axiosCache: any
export const globalConfig: any
export const ossCache: any
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
export const isOnline: (pingUrl?: string) => Promise<boolean>
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
export const expandexp: (options: any) => void
export const wxworkSuite: any
export const isdebugger: () => boolean
export const isvirtuallocation: () => boolean
export const AI: any

export type LitPreviewImageSource =
  | string
  | {
      source: string
      datetime: string
      storage?: StorageType
      watermark?: string
      watermarkcomposite?: 'blended' | 'attached'
      title?: string
    }

export interface LitPreviewImageOptions {
  images: LitPreviewImageSource[]
  index?: number
  type?: 'mobile' | 'web'
}

export const litPreviewImage: (options: LitPreviewImageOptions) => void
