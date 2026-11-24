import { normalAxios, apaasAxios } from '../axios'
import { globalConfig } from '../globalConfig'

class AIManager {
  private aiHost = ''
  private aiToken = ''
  // private aiToken =
  //   'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3OTA3MzMwNjEsIkxvZ2luVXNlciI6eyJ1c2VySWQiOjEyNjgwNzc3MjAyODY0MDA1NjEsInVzZXJOYW1lIjoiMTAwODgiLCJyb2xlSWQiOm51bGwsInRlbmFudElkIjoxMDA4OCwidmVyc2lvbiI6bnVsbCwiY2xpZW50VHlwZUNvZGUiOm51bGwsInRhc2tUeXBlcyI6WyJTS1VfTEFZRVIiLCJCTFVSX0RFVEVDVCIsIkZBS0VfUEhPVE8iLCJJTUFHRV9NRVJHRV9TS1UiLCJJTUFHRV9NRVJHRV9QUkVESUNUSU9OIiwiRElTUExBWV9QTEFDRV9ERVRFQ1QiLCJNVUxUSV9QTEFDRV9ERVRFQ1QiLCJTVE9SRV9IRUFEX1BMQUNFIiwiU1RPUkVfSEVBRF9PQ1IiLCJJTUFHRV9NRVJHRSIsIklNQUdFX1NJTUlMQVJJVFlfQ09MTEVDVF9NSUxWVVMiLCJJTUFHRV9TSU1JTEFSSVRZX0RFTEVURV9NSUxWVVMiLCJJTUFHRV9TSU1JTEFSSVRZX0RFVEVDVF9NSUxWVVMiLCJNRVJHRV9ERURVUExJQ0FUSU9OX0RFVEVDVCIsIlNVUEVSX01PREVMIiwiVklERU9fU0tVX0RFVEVDVCIsIlZJREVPX01FUkdFIiwiU0tVX0NPTUJJTkVEX0RFVEVDVCIsIkhFQVBfQVJFQV9ERVRFQ1QiXX19.FTFwWUnPegIzaB8IGg-u4FU2K145Vn0QxnPjN7kkVaE'
  private retry = 0
  private aiPhotoQualityControl: any = null // 获取照片质量管控策略 用于模糊识别

  private async getAIHOST(): Promise<string> {
    if (this.aiHost) return this.aiHost
    try {
      const AIAccountRes = await globalConfig.get('AIAccount')
      // console.log('AIAccountRes', AIAccountRes)
      const str = AIAccountRes?.configjson || ''
      if (str) {
        const json = JSON.parse(str)
        this.aiHost = json.url || ''
      }
    } catch (err) {
      console.error(err)
    }
    return this.aiHost
  }

  private async getAIToken(): Promise<string> {
    if (this.aiToken) return this.aiToken
    const res = await apaasAxios.post('/api/teapi/dy-biz/1427194513763471459/1427829089909215300')
    // console.log(res)
    // debugger
    this.aiToken = res?.data?.result?.token
    return this.aiToken
  }

  private async getAIPhotoQualityControl(): Promise<any> {
    if (this.aiPhotoQualityControl) return this.aiPhotoQualityControl
    try {
      const res = await globalConfig.get('AIPhotoQualityControl')
      // console.log('AIPhotoQualityControlRes', res)
      const str = res?.configjson || ''
      if (str) {
        const json = JSON.parse(str)
        this.aiPhotoQualityControl = json || null
      }
    } catch (err) {
      console.error(err)
    }
    return this.aiPhotoQualityControl
  }

  private async getApi(apiUrl = ''): Promise<string> {
    const host = await this.getAIHOST()
    return `${host}${apiUrl}`
  }

  public async fakeCheck(imgUrl: string): Promise<IAny> {
    const token = await this.getAIToken()
    const api = await this.getApi('/api/ai/imagequality/fakephoto')
    // console.log(token)
    // debugger
    try {
      const res = await normalAxios.post(
        api,
        {
          url: imgUrl
        },
        {
          isSendToken: false,
          headers: {
            token: token
          }
        }
      )
      // console.log('res', res)
      // debugger
      if (res.status === 401) {
        this.aiToken = ''
        return this.fakeCheck(imgUrl)
      } else if (res.status === 200) {
        if (res.data.status === 1 && typeof res.data.data === 'boolean') {
          return {
            flag: res.data.data
          }
        } else {
          throw new Error(res.data.data.errorMsg)
        }
      } else {
        throw new Error(res as any)
      }
    } catch (e) {
      // console.log('catch')
      // console.error(e)
      if (this.retry < 1) {
        this.aiToken = ''
        this.retry = 1
        return this.fakeCheck(imgUrl)
      } else {
        this.retry = 0
        throw e
      }
    }
  }

  public async blurCheck(imgUrl: string): Promise<IAny> {
    const token = await this.getAIToken()
    const api = await this.getApi('/api/ai/imagequality/blurdetect')
    const photoQuality = await this.getAIPhotoQualityControl()
    // console.log('photoQuality', photoQuality)
    // debugger
    try {
      const res = await normalAxios.post(
        api,
        {
          url: imgUrl
          // url: 'https://picx.zhimg.com/v2-1f58c1a91b2f8c87a8175aa7d529eeb5_1440w.jpg'
        },
        {
          isSendToken: false,
          headers: {
            token: token
          }
        }
      )
      // console.log('res', res)
      // debugger
      if (res.status === 401) {
        this.aiToken = ''
        return this.blurCheck(imgUrl)
      } else if (res.status === 200) {
        if (res.data.status === 1) {
          const result = res?.data?.data || {}
          if (result?.blur && photoQuality?.blurThreshold !== undefined) {
            result.flag = Number(result.blur) > Number(photoQuality.blurThreshold)
          }
          return result
        } else {
          throw new Error(res?.data?.data?.errorMsg || '识别失败')
        }
      } else {
        throw new Error(res as any)
      }
    } catch (e) {
      // console.log('catch')
      // console.error(e)
      if (this.retry < 1) {
        this.aiToken = ''
        this.retry = 1
        return this.blurCheck(imgUrl)
      } else {
        this.retry = 0
        throw e
      }
    }
  }
}

const AI = new AIManager()

export { AI }
