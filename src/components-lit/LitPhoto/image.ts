import Compressor from 'compressorjs'
import { apaasAxios } from '../../axios'

interface CompressOptions {
  quality?: number
  width?: number
  height?: number
  responseType?: 'blob' | 'base64' | 'file'
  waterMarkText?: string
  maxSize?: number // 256
}

function compress(file: File, opts: CompressOptions = {}) {
  let quality = opts.quality || 0.7
  if (quality > 1 || quality <= 0) {
    quality = 0.7
  }
  const maxSize = opts.maxSize || 256 // kb
  const mimeType = file.type
  const responseType = opts.responseType || 'file'
  return new Promise<string | Blob | File>((resolve, reject) => {
    ;(async () => {
      const { file: compressedFile } = await compressFileExecutor(file, maxSize)
      if (!compressedFile) {
        return reject(new Error())
      }
      const { width, height, image } = await getImageSize(compressedFile)
      const scale = width / height
      const w = opts.width || width
      const h = opts.height || w / scale
      // console.log('w', w, 'h', h)

      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(image, 0, 0, w, h)

      if (opts.waterMarkText) {
        addCanvasWaterMarkText(canvas, opts.waterMarkText)
      }

      if (responseType === 'blob') {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error())
            }
          },
          mimeType,
          quality
        )
      } else if (responseType === 'base64') {
        try {
          const base64 = canvas.toDataURL(mimeType, quality)
          resolve(base64)
        } catch (e) {
          reject(new Error())
        }
      } else {
        try {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                try {
                  const cFile = new window.File([blob], file.name, {
                    type: file.type
                  })
                  // console.log('blob', blob)
                  // console.log('blob.size', blob.size)
                  // console.log('quality', quality)
                  // console.log('file', file)
                  // console.log('file.size', file.size)
                  // console.log('file.name', file.name)
                  // console.log('file.type', file.type)
                  // console.log('cFile', cFile)
                  // console.log('mimeType', mimeType)
                  // console.log('cFile.size', cFile.size)
                  // console.log('cFile.name', cFile.name)
                  resolve(cFile)
                } catch (e) {
                  reject(new Error())
                }
              } else {
                reject(new Error())
              }
            },
            mimeType,
            quality
          )
        } catch (e) {
          reject(new Error())
        }
      }
    })()
  })
}

function compressFile(
  file: File,
  opts?: {
    maxWidth?: number
    width?: number
  }
): Promise<File> {
  return new Promise((resolve, reject) => {
    let quality = 0.8
    if (file.size > 1024 * 10) {
      quality = 0.2
    } else if (file.size > 1024 * 5) {
      quality = 0.4
    } else if (file.size > 1024 * 2) {
      quality = 0.6
    }
    const maxWidth = opts?.maxWidth || 4096
    const width = opts?.width || undefined
    // eslint-disable-next-line no-new
    new Compressor(file, {
      maxWidth,
      width,
      quality,
      success(blob: Blob) {
        try {
          const cFile = new window.File([blob], file.name, {
            type: file.type
          })
          resolve(cFile)
        } catch (e) {
          reject(new Error())
        }
      },
      error() {
        console.error('压缩失败')
        reject(new Error())
      }
    })
  })
}

async function compressFileExecutor(file: File, maxSize: number) {
  // console.log('compressFileExecutor')
  // console.log('file', file)
  // console.log('maxSize', maxSize)
  // // debugger
  if (file.size <= maxSize * 1024) {
    // console.log('直接返回')
    return {
      file,
      width: 0
    }
  }
  let maxWidth = 4096
  let cFile = await compressFile(file, {
    maxWidth
  })
  let lastSize = cFile.size
  while (cFile.size > maxSize * 1024) {
    // if (maxWidth < 512) {
    //     break
    // }
    maxWidth = maxWidth * 0.7
    cFile = await compressFile(cFile, {
      width: maxWidth
    })
    if (lastSize === cFile.size) {
      break
    }
    lastSize = cFile.size
  }
  return {
    file: cFile,
    width: maxWidth
  }
}

const createCanvas = (width: number, height: number) => {
  const scale = width / height
  const w = width
  const h = w / scale
  const canvas = document.createElement('canvas')
  // const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  const anw = document.createAttribute('width')
  anw.nodeValue = w + ''
  const anh = document.createAttribute('height')
  anh.nodeValue = h + ''

  canvas.setAttributeNode(anw)
  canvas.setAttributeNode(anh)
  return canvas
}

function addCanvasWaterMarkByFile(
  file: File | string,
  opts: {
    waterMarkText?: string
    responseType?: string
    width?: number
    height?: number
  } = {}
) {
  return new Promise<File | Blob | string>((resolve, reject) => {
    getImageSize(file).then(({ width, height, image }) => {
      const scale = width / height
      const w = opts.width || width
      const h = opts.height || w / scale

      const canvas = createCanvas(w, h)
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(image, 0, 0, w, h)
      if (opts.waterMarkText) {
        addCanvasWaterMarkText(canvas, opts.waterMarkText || '')
      }
      if (opts.responseType === 'base64') {
        try {
          const base64 = canvas.toDataURL('jpg', 1)
          resolve(base64)
        } catch (e) {
          console.log(e)
          reject(new Error())
        }
      } else {
        try {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (opts.responseType === 'blob') {
                  resolve(blob)
                  return
                }
                try {
                  const cFile = new window.File([blob], (file as File).name, {
                    type: (file as File).type
                  })
                  resolve(cFile)
                } catch (e) {
                  reject(new Error())
                }
              } else {
                reject(new Error())
              }
            },
            (file as File).type,
            1
          )
        } catch (e) {
          console.log(e)
          reject(new Error())
        }
      }
    })
  })
}

function addCanvasWaterMarkText(
  canvas: HTMLCanvasElement,
  watermarkText: string
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  // 文字样式
  ctx.shadowColor = '#000'
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.shadowBlur = 4
  canvas.style.fontSize = '14px'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  const fontSize = canvas.width / 378
  ctx.font = fontSize * 14 + 'px sans-serif'
  ctx.fillStyle = '#fff'
  // ctx.fillText(watermarkText, 10, canvas.height - 10)

  // 1rem = 16px
  const fontHeight = fontSize * 20
  // 画布宽度除以字号，得到一行容纳最大字体宽度值
  // const textareaWidth = Math.ceil(canvas.width / (fontHeight * 1.8))
  // 首选这里需要通过\n换行符换一次
  const list = watermarkText.split(/\n/)
  const textLines: string[] = []
  // console.log(list)
  for (let i = 0; i < list.length; i++) {
    const arrText = list[i].split('')
    let line = ''
    for (let n = 0; n < arrText.length; n++) {
      const testLine = line + arrText[n]
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth >= canvas.width - 10 && n > 0) {
        textLines.push(line)
        line = arrText[n]
      } else {
        line = testLine
      }
    }
    textLines.push(line)
  }

  // console.log(textLines)
  for (let i = 0; i < textLines.length; i++) {
    const y = canvas.height - (textLines.length - i) * fontHeight + 20
    ctx.fillText(textLines[i], 10, y)
  }

  return canvas
}

const getImageBase64 = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // reader.readAsArrayBuffer
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imgBase64 = e.target?.result as string
      resolve(imgBase64)
    }
  })
}

const getImageSize = (image: File | string) => {
  return new Promise<{
    width: number
    height: number
    image: HTMLImageElement
  }>((resolve) => {
    ;(async () => {
      let imageBase64 = ''
      // debugger
      if (typeof image === 'object') {
        imageBase64 = await getImageBase64(image)
      } else {
        // 在链接上加参数 对于关闭了公共读的云存储来说 会报415错误
        // imageBase64 =
        //   image.indexOf('?') > -1 ? `${image}&t=${new Date().getTime()}` : `${image}?t=${new Date().getTime()}`
        imageBase64 = image
      }
      const img = new window.Image()
      // debugger
      img.crossOrigin = ''
      img.addEventListener('load', () => {
        // debugger
        const { width, height } = img
        resolve({
          width,
          height,
          image: img
        })
      })
      img.src = imageBase64
    })()
  })
}

function base64ToFile(base64: string, filename: string) {
  if (!base64) {
    return null
  }
  const arr = base64.split(',')
  if (!arr.length || !arr[0]) {
    return null
  }
  // .match(/:(.*?);/)[1]
  const mimeMatcher = (arr[0] as string).match(/:(.*?);/)
  if (!mimeMatcher) {
    return null
  }
  const mime = mimeMatcher[1]
  // http://taas.wxchina.com:17042/zentao/bug-view-72120.html
  // App端返回的base64图片为 'data:image/jpg;base64,/9j/xxxxxx'
  // 返回类型 image/jpg 错误 应该是 image/jpeg 才对
  // 这会导致的canvas.toBlob体积变大很多 这里做下兼容
  // MIME类型'image/jpeg'是JPEG文件的标准类型，而'image/jpg'并不被广泛认可。错误地提供'image/jpg'可能导致问题。尽管两者在实际使用中可能通用，但技术上它们并不相同。
  // mime = mime === 'image/jpg' ? 'image/jpeg' : mime

  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

function getExtName(filePath: string) {
  return filePath.slice(filePath.lastIndexOf('.'))
}

async function imageUrlToFile(url: string, fileName: string): Promise<File | null> {
  try {
    const res: any = await apaasAxios.get(url, {
      responseType: 'blob',
      headers: {
        'content-type': ''
      }
    })
    const blob: Blob = res?.data
    if (blob?.type) {
      const cFile = new window.File([blob], fileName || '', {
        type: blob.type
      })
      return cFile
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

export type { CompressOptions }

export {
  compress,
  compressFileExecutor,
  addCanvasWaterMarkByFile,
  addCanvasWaterMarkText,
  getImageBase64,
  base64ToFile,
  getExtName,
  imageUrlToFile
}
