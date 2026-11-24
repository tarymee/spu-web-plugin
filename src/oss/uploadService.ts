import { AliClient, ObsClient, S3Client, CosClient } from './OSSClient'
import { getUuid } from '../utils'
import dayjs from 'dayjs'
import co from 'co'
import { getUser } from '../auth/login'
import cloudServ from './cloudServ'
import { getServToken } from './servtoken'
import { obsMultiUpload } from './multiUpload'
import { globalOptions } from '../index'
import ossCache from './ossCache'

interface IUpload {
  type?: 'att' | 'img'
  file: File
  source?: string
  datetime?: string | number
  storagetype?: StorageType
  onprogress?: (p: number, _checkpoint?: IAny) => void
}

const upload = async ({
  type = 'img',
  file,
  source = '',
  datetime = '',
  storagetype = 'storage',
  onprogress
}: IUpload) => {
  if (!file) throw Error('请传入文件')
  const storageConfig = cloudServ.get(storagetype)
  if (!storageConfig) throw Error('无可用存储设置')
  const servToken = await getServToken()
  if (!servToken) throw Error('无可用servToken')

  const provider = cloudServ.getProvider(storagetype)
  const tenantCode = getUser('tenantcode')
  const suffix = '.' + file.name.substring(file.name.lastIndexOf('.') + 1)
  if (source || datetime) {
    console.warn('upload 时不建议自定义传入 source 和 datetime')
  }
  source = source ? source : getUuid() + suffix
  datetime = datetime ? `${datetime}` : `${Date.now()}`

  const date = dayjs(+datetime).format('YYYYMMDD')
  const osskey = `${source.slice(0, 3)}/${type}/${date}/${tenantCode}/${source}`

  // console.log(file)
  // console.log(source)
  // console.log(datetime)
  // console.log(provider)
  // console.log(storageConfig)
  // debugger
  const promise = new Promise(async (resolve, reject) => {
    const resolveV: any = {
      key: osskey,
      source,
      filename: file.name,
      type: type,
      date: date,
      datetime: datetime,
      storage: storagetype,
      file
    }
    // 上传成功之后缓存图片
    const setCache = () => {
      if (!!globalOptions?.osscache?.flag && type === 'img') {
        ossCache.setCacheByFile({
          type,
          source,
          datetime,
          storagetype,
          file
        })
      }
    }
    if (provider?.isAliyun) {
      let progress = 0
      const ossClient = new AliClient({
        // region: storageConfig.cloudserv_storage_storageendpoint,
        endpoint: storageConfig.cloudserv_storage_storageendpoint,
        accessKeyId: servToken.accesskeyid,
        accessKeySecret: servToken.accesskeysecret,
        stsToken: servToken.securitytoken,
        bucket: storageConfig.cloudserv_storage_storagebucket,
        secure: true
      })
      co(function* () {
        // @ts-ignore
        const uploadPart = yield ossClient.multipartUpload(osskey, file, {
          headers: {
            'Content-Disposition': 'filename="' + (file.name && encodeURIComponent(file.name)) + '"' // 阿里云提供的下载名字
          },
          progress: function* (p: number, _checkpoint: IAny): any {
            // console.log('httpUploadProgress', p)
            progress = p
            if (p === 1) {
              p = 0.99
            }
            onprogress && onprogress(p)
          }
        })
        if (uploadPart.res.statusCode === 200 && progress === 1) {
          onprogress && onprogress(1)
          setCache()
          resolve(resolveV)
        } else {
          reject(new Error('Upload failed'))
        }
      }).catch((error: any) => {
        console.error(error)
        reject(error)
      })
    } else if (provider?.isHuawei) {
      const obs = new ObsClient({
        access_key_id: servToken.accesskeyid,
        secret_access_key: servToken.accesskeysecret,
        server: storageConfig.cloudserv_storage_storageendpoint,
        security_token: servToken.securitytoken,
        // 华为云自定义域名代理，设置path_style=true，把 bucket 从子域名挪到 URL 路径里
        // path_style: false（SDK 默认） 请求 URL: http://{bucket}.{server}/{key} 签名资源: /{bucket}/{key}
        // path_style: true 请求 URL: http://{server}/{bucket}/{key} 签名资源: /{bucket}/{key}
        path_style: storageConfig.cloudserv_storage_isproxy === 'true'
      })
      // const obs = new ObsClient({
      //   access_key_id: '75ISL4GWAOOO1USWUMRG',
      //   secret_access_key: 'srn6eJ1BpFbjxoFrJgiQjeS65Z3eKC3rnqeyBBlL',
      //   server: storageConfig.cloudserv_storage_storageendpoint,
      //   security_token: 'gQ5jbi1zb3V0aHdlc3QtMogAsKjYcI5CQldRAvQQJysdkZ7tAt6arLsoWHFGCaco8s8FPk6wtbslHWhvg2SZh3QMM4aUA4FhPEWQt9A7gXoC_Lh4DpF6hhHIxUyACKgakNHNPdPegy5G9-sibBXkGueIY1X3K12tzpjbyd08esLKEEu-M_QmfDoDdkgOcyidITc-lOg5EzXb27f91Ym26u2mAMTaNjCLRulJ4rziLSW6IAprSx8LUkuQQE-wUz-tMzVL9oFiVykHz980o0Y0CNdCIwn98Y-xbMdslZ3U8raydy6Wnf2LchXc0ajvMix0gg-CV0tpA4cgiZFqPxwEDXSv42hvfccboWlpGmOVR3llHLUirrlgFod8rhm-Rmk6MIfQw4NA8rddow1Gx6g-MugFV5arMDLfsOhqeSFQRJWizb3q50zk6GcUFulewitxP8HSkXMGt_rDDYCcCEmdu15D3imX5431Mbdt0qCgxH80OPCDmFXw0xMOsggxE0PBVexVY2x3wHGeql3JNyevUZAhqlskNNu77ui2Vnp-ZbHMcxgDLcPuAULINId4V_QGdhAkDaxQk53AE237DAFXtlyWWaBRMsTNVnpq9mCXJup9pdBbjLRVAO4OxfYVnwwvl-w_mb-xCgOf5EPHqA_zbZF8z-ad6JjWgLOQCHaawE7kNGHIQwAgzneik33wP2jPlG1ak9KEWyXr1n2QMJCmDM3bIrRit5_8LLFoPjXcwurBjZ-AomM_ztOe34sdr357atlQcPD7a2xWtrvn9mnqqndg12m7QxnwkmJsOYK4ZO5Hoyb2vd_NX2Nd9PaSIVAcFw=='
      // })
      try {
        const uploadRes = await obsMultiUpload(obs, file, {
          bucket: storageConfig.cloudserv_storage_storagebucket,
          key: osskey,
          parallel: 3,
          onProgress: (percent: number) => {
            onprogress && onprogress(percent)
          }
        })
        if (uploadRes) {
          setCache()
          resolve(resolveV)
        }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    } else if (provider?.isMinio || provider?.isAwss3) {
      // debugger
      // debugger
      const s3 = new S3Client({
        accessKeyId: servToken.accesskeyid,
        secretAccessKey: servToken.accesskeysecret,
        sessionToken: servToken.securitytoken,
        region: storageConfig.cloudserv_storage_region,
        endpoint: storageConfig.cloudserv_storage_storageendpoint,
        signatureVersion: 'v4',
        s3ForcePathStyle: provider?.isMinio ? true : undefined
      })
      const params = {
        Bucket: storageConfig.cloudserv_storage_storagebucket,
        Key: osskey,
        Body: file,
        ContentDisposition: 'filename="' + (file.name && encodeURIComponent(file.name)) + '"' // minIo提供的下载名字
      }
      const upload = s3.upload(params, {}).on('httpUploadProgress', (e: any) => {
        const precent: any = parseInt(e.loaded, 10) / parseInt(e.total, 10)
        // console.log('httpUploadProgress')
        // console.log(e)
        // console.log(precent)
        onprogress && onprogress(precent)
      })
      upload.send((err: any, data: any) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          setCache()
          resolve(resolveV)
        }
      })
    } else if (provider?.isCos) {
      const cos = new CosClient({
        SecretId: servToken.accesskeyid,
        SecretKey: servToken.accesskeysecret,
        SecurityToken: servToken.securitytoken
      })
      const params = {
        Bucket: storageConfig.cloudserv_storage_storagebucket,
        Region: storageConfig.cloudserv_storage_region,
        Key: osskey,
        Body: file,
        // SliceSize: 1024 * 1024 * 5, // 大于5mb才进行分块上传
        onProgress(progressData: any) {
          // loaded: 0
          // percent: 0
          // speed: 0
          // total: 12268
          // loaded: 12268
          // percent: 1
          // speed: 201.96
          // total: 12268
          onprogress && onprogress(progressData.percent)
          if (progressData.percent === 1) {
            setCache()
            resolve(resolveV)
          }
        }
      }

      cos.uploadFile(params, (err: any, data: any) => {
        if (err) {
          // console.error(err)
          // reject(err)
          // 兼容做法单片上传
          cos.putObject(params, (err: any, data: any) => {
            if (err) {
              console.error(err)
              reject(err)
            }
          })
        }
      })
    } else {
      reject(new Error(`暂不支持${provider?.name}存储类型`))
    }
  })

  return promise
}

const createTargetObj = (copykey: string, storagetype: StorageType = 'storage') => {
  const uuid = getUuid()
  const datetime = Date.now().toString()
  const date = dayjs(Number(datetime)).format('YYYYMMDD')
  const arr = copykey.split('/')
  arr[0] = uuid.slice(0, 3)
  arr[2] = date
  const arr2 = arr[arr.length - 1].split('.')
  const ext = arr2[arr2.length - 1]
  arr[arr.length - 1] = `${uuid}.${ext}`
  return {
    key: arr.join('/'),
    source: arr[arr.length - 1],
    datetime,
    date,
    type: arr[1],
    storage: storagetype
  }
}

const copy = async ({ copykey = '', storagetype = 'storage' }: any) => {
  const storageConfig = cloudServ.get(storagetype)
  if (!storageConfig) throw Error('无可用存储设置')
  const servToken = await getServToken()
  if (!servToken) throw Error('无可用servToken')

  const provider = cloudServ.getProvider(storagetype)
  const targetObj = createTargetObj(copykey, storagetype)

  return new Promise(async (resolve, reject) => {
    if (provider?.isAliyun) {
      const ossClient = new AliClient({
        endpoint: storageConfig.cloudserv_storage_storageendpoint,
        accessKeyId: servToken.accesskeyid,
        accessKeySecret: servToken.accesskeysecret,
        stsToken: servToken.securitytoken,
        bucket: storageConfig.cloudserv_storage_storagebucket,
        secure: true
        // sldEnable: true // 二级域名,ip地址
      })
      co(ossClient.copy(targetObj.key, copykey))
        .then((res: any) => {
          // console.log(res)
          // debugger
          // resolve(targetObj)
          if (res?.res?.status === 200 && res?.data?.etag) {
            resolve(targetObj)
          } else {
            console.error(res)
            reject(res)
          }
        })
        .catch((e: any) => {
          console.error(e)
          // debugger
          reject(e)
        })
    } else if (provider?.isHuawei) {
      const obs = new ObsClient({
        access_key_id: servToken.accesskeyid,
        secret_access_key: servToken.accesskeysecret,
        server: storageConfig.cloudserv_storage_storageendpoint,
        security_token: servToken.securitytoken,
        // 华为云自定义域名代理，设置path_style=true，把 bucket 从子域名挪到 URL 路径里
        // path_style: false（SDK 默认） 请求 URL: http://{bucket}.{server}/{key} 签名资源: /{bucket}/{key}
        // path_style: true 请求 URL: http://{server}/{bucket}/{key} 签名资源: /{bucket}/{key}
        path_style: storageConfig.cloudserv_storage_isproxy === 'true'
      })
      obs
        .copyObject({
          Bucket: storageConfig.cloudserv_storage_storagebucket,
          Key: targetObj.key,
          CopySource: `${storageConfig.cloudserv_storage_storagebucket}/${copykey}`
        })
        .then((res: any) => {
          if (res?.CommonMsg?.Status === 200 && res?.InterfaceResult) {
            resolve(targetObj)
          } else {
            console.error(res)
            reject(res)
          }
        })
        .catch((e: any) => {
          console.error(e)
          reject(e)
        })
    } else if (provider?.isMinio || provider?.isAwss3) {
      // debugger
      // debugger
      const s3 = new S3Client({
        accessKeyId: servToken.accesskeyid,
        secretAccessKey: servToken.accesskeysecret,
        sessionToken: servToken.securitytoken,
        region: storageConfig.cloudserv_storage_region,
        endpoint: storageConfig.cloudserv_storage_storageendpoint,
        signatureVersion: 'v4',
        s3ForcePathStyle: provider?.isMinio ? true : undefined
      })
      // console.log(s3)
      // debugger
      s3.copyObject(
        {
          Bucket: storageConfig.cloudserv_storage_storagebucket,
          CopySource: `${storageConfig.cloudserv_storage_storagebucket}/${copykey}`,
          Key: targetObj.key
        },
        (err: any, data: any) => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            // console.log(data)
            resolve(targetObj)
          }
        }
      )
    } else {
      throw Error(`暂不支持${provider?.name}存储类型`)
    }
  })
}

export default {
  upload,
  copy
}

export type { IUpload }
