import OSS from '../package/ali-oss/aliyun-oss-sdk.apaas.min.js'
// const OSS = require('../package/ali-oss/aliyun-oss-sdk.apaas.min.js')
import ObsClient from '../package/huaweicloud-obs/esdk-obs-browserjs.3.22.3.min.js'
// const ObsClient = require('../package/huaweicloud-obs/esdk-obs-browserjs.3.22.3.min.js')

import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import co from 'co'

import { getUser } from '../index'
import CloudServ from '../cloudServ'
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
  const cloudServStorage = CloudServ.get(storagetype)
  if (!cloudServStorage) throw Error('无可用存储设置')
  const servToken = await initServToken()
  if (!servToken) throw Error('无可用servToken')

  const isAliYun = CloudServ.isAliyun(storagetype)
  const isHuawei = CloudServ.isHuawei(storagetype)
  const tenantCode = getUser('tenantcode')
  const suffix = '.' + file.name.substring(file.name.lastIndexOf('.') + 1)
  source = source ? source : (uuidv4() + suffix)
  datetime = datetime ? datetime : Date.now()
  const date = dayjs(+datetime).format('YYYYMMDD')
  const objectKey = `${source.slice(0, 3)}/${type}/${date}/${tenantCode}/${source}`

  // console.log(file)
  // console.log(source)
  // console.log(datetime)
  const promise = new Promise(async (resolve, reject) => {
    if (isAliYun) {
      const ossClient = new OSS({
        // region: cloudServ.cloudserv_storage_storageendpoint,
        endpoint: cloudServStorage.cloudserv_storage_storageendpoint,
        accessKeyId: servToken.accesskeyid,
        accessKeySecret: servToken.accesskeysecret,
        stsToken: servToken.securitytoken,
        bucket: cloudServStorage.cloudserv_storage_storagebucket,
        secure: true
      })
      // promise.cancel = () => {
      //   ossClient.cancel()
      //   reject(new Error('Cancel'))
      // }
      co(function* () {
        yield ossClient.multipartUpload(objectKey, file, {
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
    } else if (isHuawei) {
        const obs = new ObsClient({
          access_key_id: servToken.accesskeyid,
          secret_access_key: servToken.accesskeysecret,
          server: cloudServStorage.cloudserv_storage_storageendpoint,
          security_token: servToken.securitytoken
        })
        // const obs = new ObsClient({
        //   access_key_id: '75ISL4GWAOOO1USWUMRG',
        //   secret_access_key: 'srn6eJ1BpFbjxoFrJgiQjeS65Z3eKC3rnqeyBBlL',
        //   server: cloudServ.cloudserv_storage_storageendpoint,
        //   security_token: 'gQ5jbi1zb3V0aHdlc3QtMogAsKjYcI5CQldRAvQQJysdkZ7tAt6arLsoWHFGCaco8s8FPk6wtbslHWhvg2SZh3QMM4aUA4FhPEWQt9A7gXoC_Lh4DpF6hhHIxUyACKgakNHNPdPegy5G9-sibBXkGueIY1X3K12tzpjbyd08esLKEEu-M_QmfDoDdkgOcyidITc-lOg5EzXb27f91Ym26u2mAMTaNjCLRulJ4rziLSW6IAprSx8LUkuQQE-wUz-tMzVL9oFiVykHz980o0Y0CNdCIwn98Y-xbMdslZ3U8raydy6Wnf2LchXc0ajvMix0gg-CV0tpA4cgiZFqPxwEDXSv42hvfccboWlpGmOVR3llHLUirrlgFod8rhm-Rmk6MIfQw4NA8rddow1Gx6g-MugFV5arMDLfsOhqeSFQRJWizb3q50zk6GcUFulewitxP8HSkXMGt_rDDYCcCEmdu15D3imX5431Mbdt0qCgxH80OPCDmFXw0xMOsggxE0PBVexVY2x3wHGeql3JNyevUZAhqlskNNu77ui2Vnp-ZbHMcxgDLcPuAULINId4V_QGdhAkDaxQk53AE237DAFXtlyWWaBRMsTNVnpq9mCXJup9pdBbjLRVAO4OxfYVnwwvl-w_mb-xCgOf5EPHqA_zbZF8z-ad6JjWgLOQCHaawE7kNGHIQwAgzneik33wP2jPlG1ak9KEWyXr1n2QMJCmDM3bIrRit5_8LLFoPjXcwurBjZ-AomM_ztOe34sdr357atlQcPD7a2xWtrvn9mnqqndg12m7QxnwkmJsOYK4ZO5Hoyb2vd_NX2Nd9PaSIVAcFw=='
        // })
        try {
          const uploadRes = await obsMultiUpload(obs, file, {
            bucket: cloudServStorage.cloudserv_storage_storagebucket,
            key: objectKey,
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
        //   Key: objectKey,
        //   SourceFile: file
        // }, (err, result) => {
        //   result.CommonMsg.Status
        //   console.error(err)
        //   console.log(result)
        //   debugger
        // })
    } else {
      throw Error('暂不支持非阿里云OSS/华为云OBS存储类型')
    }
  })

  return promise
}

export default {
  upload
}
