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

interface IUploadService {
  upload: (options: IUpload) => Promise<any>
}

// interface IServicePluginOptions {
//   modulekey: string
//   modulename: string
//   moduleversion: string
//   router?: any
// }

interface IServicePlugin {
  // install (app: App, option: IServicePluginOptions): void
  install(app: any, option: any): void
  version: string
}

declare const ServicePlugin: IServicePlugin

export default ServicePlugin

export const globalOptions: any
export const downloadService: IDownloadService
export const uploadService: IUploadService
