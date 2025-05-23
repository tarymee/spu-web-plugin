import { AliClient, ObsClient, S3Client } from './OSSClient'
import dayjs from 'dayjs'
import cloudServ from './cloudServ'
import { getServToken } from './servtoken'
import { axios } from '../axios'
import { getUser } from '../login'
// import { get } from 'lodash-es'
// import qs from 'qs'

// function getUrlPaths(url: string): string[] {
//   let path = url.split('?')[0]
//   if (!path) return []
//   path = path.replace('http://', '')
//   path = path.replace('https://', '')
//   return path.split('/')
// }

const getContentType = (suffix: string) => {
  const map: IAny = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
    // '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
  return map[suffix.toLowerCase()] || ''
}

// 如果url是ip则返回true，是域名则返回false
const isIpUrl = (url: string) => {
  // 匹配ip的正则表达式
  const reg = /((\w+):\/\/)?(\d+)\.(\d+)\.(\d+)\.(\d+)/
  return reg.test(url)
}

// interface UrlInfo {
//   [propName: string]: {
//     url: string
//     outTime: number
//   }
// }

// /**
//  * @Description: 缓存DownloadUrl
//  * @author: hyl
//  */
// const cacheUrlInfo: UrlInfo = {}

// function setCacheUrl(key: string, url: string, expires: number) {
//   const thisTime = new Date().getTime()
//   let diff = expires * 1000 - thisTime
//   if (diff < 0) return
//   // 最多只缓存20分钟
//   if (diff > 1000 * 60 * 20) diff = 1000 * 60 * 20
//   const outTime = thisTime + diff
//   cacheUrlInfo[key] = {
//     url,
//     outTime
//   }
// }

type Cope = { width?: number | string; height?: number | string } | string | boolean

const getAliyunCope = (cope?: Cope) => {
  let str = ''
  if (cope) {
    if (cope === true) {
      str = 'image/resize,m_fixed,w_100,h_100'
    } else if (typeof cope === 'string') {
      str = cope
    } else if (cope.width || cope.height) {
      str = 'image/resize,m_fixed'
      if (cope.width) {
        const width = String(cope.width).replace('px', '')
        str += `,w_${width}`
      }
      if (cope.height) {
        const height = String(cope.height).replace('px', '')
        str += `,h_${height}`
      }
    }
  }
  return str
}

const getCope = (cope?: Cope) => {
  let str = ''
  if (cope) {
    if (cope === true) {
      str = 'image/resize,m_fixed,w_100,h_100'
    } else if (typeof cope === 'string') {
      str = cope
    } else if (cope.width || cope.height) {
      str = 'image/resize,m_fixed'
      let width = ''
      let height = ''
      if (cope.width && !cope.height) {
        width = String(cope.width).replace('px', '')
        height = width
      } else if (cope.height && !cope.width) {
        height = String(cope.height).replace('px', '')
        width = height
      } else if (cope.width && cope.height) {
        width = String(cope.width).replace('px', '')
        height = String(cope.height).replace('px', '')
      }
      str += `,w_${width},h_${height}`
    }
  }
  return str
}

interface IDownload {
  type?: 'att' | 'img'
  source: string
  datetime: string | number
  storagetype?: StorageType
  cope?: Cope
  filename?: string // 下载文件名
}

// 根据文件信息最后生成一个云文件服务可以用的链接http://xxxxx.xxx.jpg
const getUrl = async ({
  type = 'img',
  source = '',
  filename = '',
  datetime = '',
  storagetype = 'storage',
  cope = ''
}: IDownload) => {
  const storageConfig = cloudServ.get(storagetype)
  if (!storageConfig) throw Error('无可用存储设置')
  const servToken = await getServToken()
  if (!servToken) throw Error('无可用servToken')

  const tenantCode = getUser('tenantcode')
  const provider = cloudServ.getProvider(storagetype)

  if (!filename) {
    filename = source
  }
  const isAbsoluteUrl =
    !!source.match(/\/att\//) || !!source.match(/\/img\//) || !!source.match(/att\//) || !!source.match(/img\//)
  const suffix = filename.slice(filename.lastIndexOf('.'))
  const date = dayjs(+datetime).format('YYYYMMDD')
  let objectKey = isAbsoluteUrl ? source : `${source.slice(0, 3)}/${type}/${date}/${tenantCode}/${source}`
  const copeStr = provider?.isAliyun ? getAliyunCope(cope) : getCope(cope)
  const contentType = getContentType(suffix)

  if (provider?.isAliyun) {
    const ossClient = new AliClient({
      // region: storageConfig.cloudserv_storage_storageendpoint,
      endpoint: storageConfig.cloudserv_storage_storageendpoint,
      accessKeyId: servToken.accesskeyid,
      accessKeySecret: servToken.accesskeysecret,
      stsToken: servToken.securitytoken,
      bucket: storageConfig.cloudserv_storage_storagebucket,
      secure: true
    })

    // TODO 这两个请求头不能改顺序，不知道什么情况！！改了顺序会报错
    const responseHeader: IAny = {
      // 'content-type': contentType || undefined,
      'content-disposition': 'attachment; filename=' + (filename && encodeURIComponent(filename)) // 阿里云提供的下载名字
    }
    if (contentType) {
      responseHeader['content-type'] = contentType
    }

    const ossUrl = ossClient.signatureUrl(objectKey, {
      response: responseHeader,
      process: copeStr
    })

    // // 假阿里云会自动拼cloudserv_storage_storagebucket，这里要去掉
    // const paths = getUrlPaths(ossUrl)
    // if (paths.length >= 3 && paths[1] === paths[2]) {
    //   ossUrl = ossUrl.replace(paths[1] + '/' + paths[2], paths[1])
    // }

    return ossUrl
  } else if (provider?.isHuawei) {
    const obs = new ObsClient({
      access_key_id: servToken.accesskeyid,
      secret_access_key: servToken.accesskeysecret,
      server: storageConfig.cloudserv_storage_storageendpoint,
      security_token: servToken.securitytoken
    })
    // 修复地址里面有//就不能下载了
    if (objectKey && objectKey[0] === '/') {
      objectKey = objectKey.slice(1)
    }
    try {
      const Params: IAny = {
        // Method: 'get',
        Bucket: storageConfig.cloudserv_storage_storagebucket,
        Key: objectKey
        // Headers: responseHeader
        // Expires: 3600,
        // Headers: headers
      }
      if (contentType.startsWith('image') && copeStr) {
        Params.QueryParams = {
          'x-image-process': copeStr
        }
      }
      const res = obs.createSignedUrlSync(Params)
      const signedUrl = res.SignedUrl

      // const expires = get(qs.parse(signedUrl), 'Expires') as string
      // if (expires) setCacheUrl(cacheKey, signedUrl, +expires)

      // 华为云通过 createSignedUrlSync 生产的签名链接默认带有 :80 或者 :443 端口 后端删除时需要去除
      return signedUrl.replace(/:(80|443)/, '')
    } catch (e: any) {
      console.error(e)
      throw Error(e)
    }
  } else if (provider?.isMinio) {
    const s3Params: IAny = {
      accessKeyId: servToken.accesskeyid,
      secretAccessKey: servToken.accesskeysecret,
      sessionToken: servToken.securitytoken,
      signatureVersion: 'v4',
      endpoint: storageConfig.cloudserv_storage_storageendpoint,
      region: storageConfig.cloudserv_storage_region
    }
    // minio和url为ip的需要将存储桶后置
    if (provider?.isMinio || isIpUrl(storageConfig.cloudserv_storage_storageurl)) {
      s3Params.s3ForcePathStyle = true
    }
    const s3 = new S3Client(s3Params)

    // awss3缩略图没方案处理
    const params = {
      Expires: 60 * 60 * 24 * 7,
      Bucket: storageConfig.cloudserv_storage_storagebucket,
      Key: objectKey[0] === '/' ? objectKey.slice(1) : objectKey
    }

    const getSignedUrlPro = () => {
      return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', params, (err: any, data: any) => {
          if (err) {
            console.error(err)
            reject(new Error(err))
          } else {
            if (provider?.isMinio && copeStr) {
              data = `${data}&x-oss-process=${copeStr}`
              // data = `${data}&x-oss-process=image/resize,m_fixed,w_100,h_`
            }
            resolve(data)
            console.log(data)
          }
        })
      })
    }

    const signedUrl = await getSignedUrlPro()
    // console.log(signedUrl)
    return signedUrl
  } else {
    throw Error(`暂不支持${provider?.name}存储类型`)
  }
}

const downloadFileByUrl = (url: string, filename: string) => {
  const aElm = document.createElement('a')
  aElm.innerHTML = filename
  aElm.download = filename
  aElm.target = '_blank'
  aElm.href = url
  document.body.appendChild(aElm)
  let evt = document.createEvent('MouseEvents')
  evt.initEvent('click', false, false)
  aElm.dispatchEvent(evt)
  document.body.removeChild(aElm)
}

const downloadFileByBlob = (blob: any, filename: string) => {
  const aElm = document.createElement('a')
  aElm.innerHTML = filename
  aElm.download = filename
  aElm.target = '_blank'
  aElm.href = window.URL.createObjectURL(blob)
  document.body.appendChild(aElm)
  let evt = document.createEvent('MouseEvents')
  evt.initEvent('click', false, false)
  aElm.dispatchEvent(evt)
  document.body.removeChild(aElm)
}

const downloadFile = async ({
  type = 'img',
  source = '',
  datetime = '',
  storagetype = 'storage',
  cope = '',
  filename = ''
}: IDownload) => {
  if (!filename) {
    filename = source
  }

  const suffix = filename.slice(filename.lastIndexOf('.'))
  const realFilename =
    filename.replace(suffix, '') +
    dayjs(+datetime).format('_YYYYMMDDHHmmssS') +
    String(Math.floor(Math.random() * 9000) + 1000) +
    suffix

  // console.log(filename)
  const url = await getUrl({
    type,
    source,
    datetime,
    storagetype,
    filename: realFilename,
    cope
  })
  // axios.get(url, {
  //   responseType: 'blob',
  //   isSendToken: false,
  //   isShowErrorMessage: false
  // }).then((response: any) => {
  //   // console.log(response)
  //   // debugger
  //   downloadFileByBlob(response.data, filename)
  // }).catch((e) => {
  //   console.log(e)
  //   throw Error(e)
  // })

  const provider = cloudServ.getProvider(storagetype)
  if (provider?.isAliyun) {
    downloadFileByUrl(url, filename)
  } else {
    axios
      .get(url, {
        responseType: 'blob',
        isSendToken: false,
        isShowErrorMessage: false
      })
      .then((response: any) => {
        // console.log(response)
        // debugger
        downloadFileByBlob(response.data, filename)
      })
      .catch((e: any) => {
        console.log(e)
        throw Error(e)
      })
  }
}

export default {
  getUrl,
  downloadFile
}
