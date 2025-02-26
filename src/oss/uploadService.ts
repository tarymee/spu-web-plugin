import OSS from '../package/ali-oss/aliyun-oss-sdk.apaas.min.js'
// const OSS = require('../package/ali-oss/aliyun-oss-sdk.apaas.min.js')

import ObsClient from '../package/huaweicloud-obs/esdk-obs-browserjs.3.22.3.min.js'
// const ObsClient = require('../package/huaweicloud-obs/esdk-obs-browserjs.3.22.3.min.js')

// import '../package/aws-sdk/aws-sdk.min.js'
import 'aws-sdk/dist/aws-sdk.min.js'
// var S3 = require('aws-sdk/clients/s3')
// import S3 from 'aws-sdk/clients/s3'
// import S3 from 'aws-sdk'
// import S3 from 'aws-sdk/dist/aws-sdk.js'
// import * as S3 from 'aws-sdk/dist/aws-sdk.js'
// import AWS from '../package/aws-sdk/aws-sdk.min.js'
// import * as AWS from 'aws-sdk'

import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import co from 'co'

import { getUser } from '../index'
import cloudServ from '../cloudServ'
import { initServToken } from './servtoken'
import { obsMultiUpload } from './multiUpload'


interface IUpload {
  type?: 'att' | 'img',
  file: File,
  source?: string,
  datetime?: string | number,
  storagetype?: StorageType,
  onprogress?: (p: number, _checkpoint?: IAny) => void
}

const upload = async ({
  type = 'img',
  file,
  source = '',
  datetime = '',
  storagetype = 'storage',
  onprogress,
}: IUpload) => {
  if (!file) throw Error('请传入文件')
  const storageConfig = cloudServ.get(storagetype)
  if (!storageConfig) throw Error('无可用存储设置')
  const servToken = await initServToken()
  if (!servToken) throw Error('无可用servToken')

  const provider = cloudServ.getProvider(storagetype)
  const tenantCode = getUser('tenantcode')
  const suffix = '.' + file.name.substring(file.name.lastIndexOf('.') + 1)
  source = source ? source : (uuidv4() + suffix)
  datetime = datetime ? datetime : Date.now()
  const date = dayjs(+datetime).format('YYYYMMDD')
  const osskey = `${source.slice(0, 3)}/${type}/${date}/${tenantCode}/${source}`

  // console.log(file)
  // console.log(source)
  // console.log(datetime)
  // console.log(provider)
  // console.log(storageConfig)
  // debugger
  const promise = new Promise(async (resolve, reject) => {
    if (provider?.isAliyun) {
      const ossClient = new OSS({
        // region: storageConfig.cloudserv_storage_storageendpoint,
        endpoint: storageConfig.cloudserv_storage_storageendpoint,
        accessKeyId: servToken.accesskeyid,
        accessKeySecret: servToken.accesskeysecret,
        stsToken: servToken.securitytoken,
        bucket: storageConfig.cloudserv_storage_storagebucket,
        secure: true
      })
      co(function* () {
        yield ossClient.multipartUpload(osskey, file, {
          headers: {
            'Content-Disposition': 'filename="' + (file.name && encodeURIComponent(file.name)) // 阿里云提供的下载名字
          },
          progress: function* (p: number, _checkpoint: IAny): any {
            // console.log('httpUploadProgress', p)
            onprogress && onprogress(p, _checkpoint)
            if (p === 1) {
              resolve({
                source,
                filename: file.name,
                type: file.type,
                date: date,
                datetime: datetime,
                file
              })
            }
          }
        })
      }).catch((error: any) => {
        console.error(error)
        reject(error)
      })
    } else if (provider?.isHuawei) {
        const obs = new ObsClient({
          access_key_id: servToken.accesskeyid,
          secret_access_key: servToken.accesskeysecret,
          server: storageConfig.cloudserv_storage_storageendpoint,
          security_token: servToken.securitytoken
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
            resolve({
              source,
              filename: file.name,
              type: file.type,
              date: date,
              datetime: datetime,
              file
            })
          }
        } catch (e) {
          console.error(e)
          reject(e)
        }
        // obs.putObject({
        //   Bucket: cloudServ.cloudserv_storage_storagebucket,
        //   Key: osskey,
        //   SourceFile: file
        // }, (err, result) => {
        //   result.CommonMsg.Status
        //   console.error(err)
        //   console.log(result)
        //   debugger
        // })
    } else if (provider?.isMinio || provider?.isAwss3) {
      // console.error(9874)
      // console.log(S3)
      // console.log(window.AWS)
      const S3 = window?.AWS?.S3
      // debugger
      // debugger
      const s3 = new S3({
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
        Body: file
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
          resolve({
            key: osskey,
            source,
            filename: file.name,
            type: file.type,
            date: date,
            datetime: datetime,
            file
          })
        }
      })
    } else {
      throw Error(`暂不支持${provider?.name}存储类型`)
    }
  })

  return promise
}

export default {
  upload
}
