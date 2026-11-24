// import { showConfirmDialog } from 'vant'
import { cloneDeep } from 'lodash-es'
import { base64ToFile, getExtName } from './image'

interface IPhotoConfig {
  capture: 'camera' | 'all' | 'album' // 'camera' | 'all'
  appcompression: number
  watermark: string
  watermarkcomposite: 'blended' | 'attached' // defalut blended
  callback: (e: Event) => void
  // multiple: boolean // 暂不支持多选
}

interface ISelectPhotoFile {
  filePath: string
  file: string // base64
}

const getPhotoParams = (config: IPhotoConfig) => {
  if (config.capture === 'all') {
    return false
  }

  let photoParms = null
  if (config.capture === 'camera') {
    photoParms = window.aPaaS.PhotoDefaultConfig.camera()
  } else if (config.capture === 'album') {
    photoParms = window.aPaaS.PhotoDefaultConfig.album()
  }
  console.log('native photoParms')
  console.log(JSON.stringify(photoParms))
  // photoParms.watermarkrequired = config.watermark ? '1' : '0'
  // photoParms.watermarkcomposite = config.watermarkcomposite || 'blended'

  // photoParms.compression 默认是 2
  photoParms.compression = config.appcompression.toString()

  photoParms.watermarkrequired = '0'
  // photoParms.watermark = '' // 如果加其他的属性配置项 安卓不识别调不起拍照
  photoParms.watermarkcomposite = 'blended'
  // photoParms.watermarkcomposite = 'attached'
  // photoParms.watermark = config.watermark
  // photoParms.watermarkcomposite = config.watermarkcomposite || 'blended'
  photoParms.checkwatermark = '0'
  photoParms.maxnumber = '1'
  // if (config.multiple) {
  //   photoParms.maxnumber = String(+props.maxSize - state.files.length)
  // } else {
  //   photoParms.maxnumber = '1'
  // }
  console.log('finally photoParms')
  console.log(JSON.stringify(photoParms))
  return photoParms
}

const getNativePhoto = async (config: IPhotoConfig) => {
  const selectConfig = cloneDeep(config)
  if (config.capture === 'all') {
    try {
      // await showConfirmDialog({
      //   title: '请选择',
      //   // message: '拍照 or 从相册中获取？',
      //   confirmButtonText: '拍照',
      //   confirmButtonColor: '#ee0a24',
      //   cancelButtonText: '从相册中获取',
      //   cancelButtonColor: 'black',
      //   showCancelButton: true
      // })
      selectConfig.capture = 'camera'
    } catch (err) {
      selectConfig.capture = 'album'
    }
  }
  window.aPaaS.getPhoto(
    getPhotoParams(selectConfig),
    (
      photos: Array<ISelectPhotoFile>,
      error: { errMsg: string; errno: number },
      status: 'success' | 'fail' | 'complete'
    ) => {
      console.log('window.aPaaS.getPhoto')
      console.log(photos)
      console.log(error)
      console.log(status)

      if (!photos || !photos.length || status === 'fail') {
        window.alert(error?.errMsg || error.toString())
        return
      }

      let files: any[] = []
      if (photos.length) {
        files = photos.map((item) => {
          // console.log('base64', item.file)
          // console.log('base64.length', item.file.length)
          // 注意 这里 App 返回的 base64 格式错误
          return base64ToFile(item.file, getExtName(item.filePath))
        })
      }
      // console.log('file', files[0])
      // console.log('size', files[0].size)
      // console.log('name', files[0].name)
      // console.log('type', files[0].type)

      config.callback({
        target: {
          files,
          others: photos.map((file) => {
            return {
              ...file,
              file: undefined
            }
          })
        } as any
      } as Event)
    }
  )
}

const checkIsCanUseGetNativePhoto = () => {
  return (
    typeof window?.aPaaS?.getPhoto === 'function' &&
    window?.aPaaS?.PhotoDefaultConfig?.camera &&
    window?.aPaaS?.PhotoDefaultConfig?.album
  )
}

export { getNativePhoto, checkIsCanUseGetNativePhoto }
