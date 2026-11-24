import { downloadService, uploadService } from '../../oss'
import { compress, addCanvasWaterMarkByFile, imageUrlToFile } from './image'
import { getUuid, getServerTime, delay } from '../../utils'
import { AI } from '../../AI'
import { getLocation } from '../../map/index'
import dayjs from 'dayjs'

type IUploadState = '-1' | '0' | '1' | '2' | '3'
type IBlurFakeCheck = '0' | '1' | '2'
type IBlurFakeResult = '0' | '1' | '2' | ''
type IBlurFakeState = '0' | '1' | '2'

interface IPhotoItem {
  type: 'add' | 'view'
  title?: string
  file?: File
  source?: string
  datetime?: string
  storage?: StorageType
  watermark?: string
  watermarkcomposite?: 'blended' | 'attached'

  thumbnailsize?: string
  compression?: string

  islocation?: boolean
  latitude?: string
  longitude?: string
  address?: string

  blurcheck?: IBlurFakeCheck
  blurstate?: IBlurFakeState
  isblur?: IBlurFakeResult

  fakecheck?: IBlurFakeCheck
  fakestate?: IBlurFakeState
  isfake?: IBlurFakeResult

  uploadstate?: IUploadState
}

interface IPhotoValue {
  source: string
  datetime: string
  storage: StorageType
  title?: string
  latitude?: string
  longitude?: string
  address?: string
  watermark?: string
  watermarkcomposite?: 'blended' | 'attached'
  uploadstate?: IUploadState
  isblur?: IBlurFakeResult
  isfake?: IBlurFakeResult
}

class PhotoManger {
  type: 'add' | 'view' = 'add'
  file?: File = undefined
  title: string = ''
  source: string = ''
  datetime: string = ''
  storage: StorageType = 'storage'
  watermark: string = ''
  // 水印合成方式
  // blended: 水印直接合成在原始图片上
  // attached: 水印存储在照片的值当中 需要在显示时临时合成
  watermarkcomposite: 'blended' | 'attached' = 'blended'
  // 前端Compressor.js压缩参数 https://www.npmjs.com/package/compressorjs
  // 默认1表示不压缩，一般0.6压缩
  // 0 2.12MB 114.61 KB 94.72% -
  // 0.2 2.12MB 349.57 KB 83.90% -
  // 0.4 2.12MB 517.10 KB 76.18% -
  // 0.6 2.12MB 694.99 KB 67.99% Recommend
  // 0.8 2.12MB 1.14 MB 46.41% Recommend
  // 1   2.12MB 2.12 MB 0% Not recommend
  compression: string = '1'
  thumbnailsize: string = '200'
  islocation: boolean = false
  latitude: string = ''
  longitude: string = ''
  address: string = ''
  // '-1'图片未拍摄 '0'未上传 '1'上传中 '2'上传完成 '3'上传失败
  uploadstate: IUploadState = '-1'
  // 上传进度 0 - 100
  uploadprogress = 0
  // AI 模糊检测 请确保租户已经开通了该 AI 服务
  // '0' 关闭 不检测
  // '1' 警告 控件角标显示提示，不阻止提交表单
  // '2' 强制 控件角标显示提示，并且阻止提交表单
  blurcheck: IBlurFakeCheck = '0'
  // 检测状态 '0'未检测 '1'检测中 '2'检测完成【失败也算完成】
  blurstate: IBlurFakeState = '0'
  // 检测结果
  // "" 关闭不检测/检测中
  // "0" 检测失败
  // "1" 清晰
  // "2" 模糊
  isblur: IBlurFakeResult = ''
  // AI 翻拍检测 规则与 blurcheck 相同
  fakecheck: IBlurFakeCheck = '0'
  fakestate: IBlurFakeState = '0'
  isfake: IBlurFakeResult = ''
  sourceurl = '' // 原图 大图
  sourcewithwatermarkurl = '' // 当水印为临时合成时 原图与水印的合成图 blob
  fileobjecturl = '' // 未上传之前的预览图 用 file 转成的 objectURL
  thumburl = '' // 缩略图

  get showurl() {
    return this.thumburl || this.fileobjecturl || this.sourceurl || ''
  }

  get bigurl() {
    return (
      this.sourcewithwatermarkurl || this.sourceurl || this.fileobjecturl || this.thumburl || ''
    )
  }

  get tagdata() {
    const data: {
      color: string
      text: string
      key: string
    }[] = []
    if (this.isblur === '2') {
      data.push({
        color: '#E16F24',
        text: '糊',
        key: 'blur'
      })
    }
    if (this.isfake === '2') {
      data.push({
        color: '#F43F4F',
        text: '翻',
        key: 'fake'
      })
    }
    return data
  }

  constructor(fileItem: IPhotoItem) {
    fileItem.type && (this.type = fileItem.type)

    fileItem.title && (this.title = fileItem.title)
    fileItem.watermark && (this.watermark = fileItem.watermark)
    fileItem.watermarkcomposite && (this.watermarkcomposite = fileItem.watermarkcomposite)
    fileItem.compression && (this.compression = fileItem.compression)

    fileItem.storage && (this.storage = fileItem.storage)
    fileItem.thumbnailsize && (this.thumbnailsize = fileItem.thumbnailsize)

    fileItem.latitude && (this.latitude = fileItem.latitude)
    fileItem.longitude && (this.longitude = fileItem.longitude)
    fileItem.address && (this.address = fileItem.address)
    if (fileItem.latitude || fileItem.islocation) {
      this.islocation = true
    }

    fileItem.blurcheck && (this.blurcheck = fileItem.blurcheck)
    fileItem.fakecheck && (this.fakecheck = fileItem.fakecheck)

    if (this.type === 'add') {
      if (fileItem.file) {
        this.setFile(fileItem.file)
        console.warn('type = add 时，没有传入 file，等待传入')
      }
      if (fileItem.source || fileItem.datetime) {
        console.error('type = add 时，不需要传入 source/datetime')
      }
    } else {
      if (fileItem.source && fileItem.datetime) {
        this.source = fileItem.source
        this.datetime = fileItem.datetime
        this.uploadstate = '2'
        this.uploadprogress = 100
      } else {
        console.warn('type = view 时，缺少传入 source/datetime，认为未拍摄就提交')
        // 认为未拍摄
        this.uploadstate = '-1'
      }
      if (fileItem.isblur) {
        this.isblur = fileItem.isblur
        this.blurstate = '2'
        // this.blurstate = '1'
      }
      if (fileItem.isfake) {
        this.isfake = fileItem.isfake
        this.fakestate = '2'
        // this.fakestate = '1'
      }
    }
  }

  setFile(file: File) {
    this.file = file
    this.fileobjecturl = window.URL.createObjectURL(file)
    this.uploadstate = '0'
  }

  // 为图片url添加水印
  // todo 加载不了https的图片？
  async addWaterMarkByImageUrl(imageurl: string, filename: string, watermark: string) {
    // 如果有水印且水印不是直接合成在原始图片上
    const file = await imageUrlToFile(imageurl, filename)
    // debugger
    if (file) {
      const watermarkFile = (await addCanvasWaterMarkByFile(file as File, {
        waterMarkText: watermark
      })) as File
      return window.URL.createObjectURL(watermarkFile)
    } else {
      return null
    }
  }

  async loadShowurl() {
    if (this.thumbnailsize) {
      this.loadThumburl()
    } else {
      this.loadSourceurl()
    }
  }

  // 获取查看大图
  async loadBigurl() {
    await this.loadSourceurl()
    if (this.sourceurl) {
      return
    }

    if (this.fileobjecturl) {
      return
    }

    await this.loadThumburl()
    if (this.thumburl) {
      return
    }
  }

  async loadThumburl() {
    if (this.thumburl) return

    if (this.source && this.datetime) {
      try {
        const thumburl = await downloadService.getUrl({
          type: 'img',
          source: this.source,
          datetime: this.datetime,
          cope: {
            width: this.thumbnailsize
          }
        })
        // debugger
        this.thumburl = thumburl // 缩略图不打水印
      } catch (e) {
        console.error(e)
      }
    }
  }

  async loadSourceurl() {
    if (this.sourceurl) return

    if (this.source && this.datetime) {
      try {
        const res = await downloadService.getUrl({
          type: 'img',
          source: this.source,
          datetime: this.datetime,
          cope: undefined
        })
        this.sourceurl = res

        // 如果有水印且水印不是直接合成在原始图片上
        if (this.watermark && this.watermarkcomposite === 'attached') {
          try {
            const url = await this.addWaterMarkByImageUrl(res, this.source, this.watermark)
            url && (this.sourcewithwatermarkurl = url)
          } catch (err) {
            console.error(err)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  async upload() {
    if (!this.file) {
      window.alert('没有传入 file 文件，无法上传。')
      return false
    }
    const suffix = '.' + this.file.name.substring(this.file.name.lastIndexOf('.') + 1)
    // 开始上传
    this.uploadstate = '1'
    this.uploadprogress = 0
    const datetime = Date.now() + ''
    const source = getUuid() + suffix

    try {
      const uploadFile = await this.createUploadFile()
      await uploadService.upload({
        type: 'img',
        file: uploadFile,
        source: source,
        datetime: datetime,
        storagetype: this.storage,
        onprogress: (percent: any) => {
          this.uploadprogress = Number(Number(percent * 100).toFixed(1))
          // console.log('this.uploadprogress', this.uploadprogress)
        }
      })
      this.source = source
      this.datetime = datetime
      this.uploadstate = '2'
    } catch (e) {
      console.error(e)
      this.uploadstate = '3'
    }
    // const thumburl = await downloadService.getUrl({
    //   type: 'img',
    //   source: this.source,
    //   datetime: this.datetime
    // })
    // console.log(thumburl)
    // console.log(this.watermark)

    await this.AICheck()
  }

  // 图片上传完成之后检测
  async AICheck() {
    if (this.blurcheck !== '0' || this.fakecheck !== '0') {
      if (this.source && this.datetime && this.uploadstate === '2') {
        await delay(200)
        await this.loadSourceurl()

        if (this.blurcheck !== '0') {
          if (this.sourceurl) {
            try {
              this.blurstate = '1'
              const result = await AI.blurCheck(this.sourceurl)
              // console.log(result)
              this.isblur = result.flag ? '2' : '1'
              this.blurstate = '2'
            } catch (err) {
              console.error(err)
              this.isblur = '0'
              this.blurstate = '2'
            }
          } else {
            this.isblur = '0'
            this.blurstate = '2'
          }
        }
        if (this.fakecheck !== '0') {
          if (this.sourceurl) {
            try {
              this.fakestate = '1'
              const result = await AI.fakeCheck(this.sourceurl)
              // console.log(result)
              this.isfake = result.flag ? '2' : '1'
              this.fakestate = '2'
            } catch (err) {
              console.error(err)
              this.isfake = '0'
              this.fakestate = '2'
            }
          } else {
            this.isfake = '0'
            this.fakestate = '2'
          }
        }
      } else {
        if (this.blurcheck !== '0') {
          this.isblur = '0'
          this.blurstate = '2'
        }
        if (this.fakecheck !== '0') {
          this.isfake = '0'
          this.fakestate = '2'
        }
      }
    }
  }

  async createUploadFile() {
    let uploadFile = this.file as File

    if (
      (this.islocation || this.watermark.indexOf('{address}') !== -1) &&
      !this.latitude &&
      !this.address
    ) {
      // const loadingToast = showLoadingToast({
      //   message: '定位中...',
      //   duration: 0,
      //   forbidClick: true
      // })
      const location = await getLocation()
      if (location) {
        this.latitude = location.latitude
        this.longitude = location.longitude
        this.address = location.address || '未知地址'
      }
    }
    if (this.watermark.indexOf('{address}') !== -1) {
      this.watermark = this.watermark.replace('{address}', this.address || '未知地址')
    }

    if (this.watermark.indexOf('{date}') !== -1) {
      const nowtime = await getServerTime()
      this.watermark = this.watermark.replace(
        '{date}',
        dayjs(Number(nowtime)).format('YYYY-MM-DD HH:mm:ss')
      )
    }

    if (this.compression && Number(this.compression) < 1) {
      if (this.watermark && this.watermarkcomposite === 'blended') {
        uploadFile = (await compress(uploadFile, {
          quality: Number(this.compression),
          waterMarkText: this.watermark
        })) as File
      } else {
        // console.log('有压缩')
        uploadFile = (await compress(uploadFile, {
          quality: Number(this.compression)
        })) as File
      }
    } else if (this.watermark && this.watermarkcomposite === 'blended') {
      // 打水印 临时合成不需要做 只在图片查看的时候去做水印就可以了
      uploadFile = (await addCanvasWaterMarkByFile(uploadFile, {
        waterMarkText: this.watermark
      })) as File
    }
    // console.log('createUploadFile')
    // console.log(uploadFile)
    // console.log(uploadFile.size)
    return uploadFile
  }

  getValue() {
    const value: IPhotoValue = {
      source: this.source,
      datetime: this.datetime,
      storage: this.storage
    }

    if (this.watermark && this.watermarkcomposite === 'attached') {
      value.watermark = this.watermark
      value.watermarkcomposite = this.watermarkcomposite
    }

    if (this.title) {
      value.title = this.title
    }

    if (this.islocation) {
      value.latitude = this.latitude || ''
      value.longitude = this.longitude || ''
      value.address = this.address || ''
    }
    if (this.blurcheck !== '0') {
      value.isblur = this.isblur || ''
    }
    if (this.fakecheck !== '0') {
      value.isfake = this.isfake || ''
    }
    // 图片没拍为空字符串
    return this.uploadstate === '-1' ? '' : value
  }

  // 校验
  validata() {
    let msg = ''

    // if (this.uploadstate === '-1') {
    //   msg = '图片未拍摄/未选择'
    // }
    if (this.uploadstate === '0') {
      msg = '图片未上传'
    } else if (this.uploadstate === '1') {
      msg = '图片上传中'
    } else if (this.uploadstate === '3') {
      msg = '图片上传失败'
    } else if (this.uploadstate === '2') {
      if (this.blurcheck !== '0') {
        if (this.blurstate !== '2') {
          msg = '图片未完成模糊检测'
        } else if (this.blurcheck === '2' && this.isblur === '2') {
          msg = '图片为模糊图片'
        }
      } else if (this.fakecheck !== '0') {
        if (this.fakestate !== '2') {
          msg = '图片未完成翻拍检测'
        } else if (this.fakecheck === '2' && this.isfake === '2') {
          msg = '图片为翻拍图片'
        }
      }
    }

    return {
      msg
    }
  }
}

export type { IPhotoItem, IPhotoValue }
export { PhotoManger }
