import { apaasAxios } from '../../axios'
import { cloneDeep, set, get } from 'lodash-es'
import { urlquery } from '../../urlquery'
import { getAddress } from '../../map/index'

class MiniprogramTask {
  name = ''
  params = {}
  taskid = ''
  duration = 5000 // 任务持续时间 超过时间报错
  timelag = 800 // 任务轮询时间间隔
  starttime = 0
  endtime = 0
  private timer: number | null = null

  constructor(name: string, params: any = {}, duration = 5000) {
    this.name = name
    this.params = cloneDeep(params)
    this.duration = duration
    this.starttime = Date.now()
  }

  async execute(): Promise<any> {
    const taskid = await this.request()
    let res = null
    if (taskid) {
      res = await this.getResult()
    }
    return res
  }

  async request() {
    try {
      const res = await apaasAxios.post(
        '/api/masterserv/hpage/syncdata/request',
        {
          sessionid: urlquery.syncdatasessionid,
          type: JSON.stringify({
            name: this.name,
            params: this.params
          })
        },
        {
          isShowLoading: false,
          isSendToken: false,
          isSendTecode: false,
          isShowErrorMessage: false
        } as any
      )

      // console.log('request', res)
      // debugger
      this.taskid = res?.data?.taskid || ''
    } catch (err) {
      console.error(err)
      // if (err?.response?.data?.error_code === '参数错误，sessionid不符合格式') {
      //   isCanGetLocationByMiniprogram = false
      // }
    }

    return this.taskid
  }

  async receive() {
    let res = null
    try {
      res = await apaasAxios.post(
        '/api/masterserv/hpage/syncdata/get',
        {
          sessionid: urlquery.syncdatasessionid,
          taskid: this.taskid
        },
        {
          isShowLoading: false,
          isSendToken: false,
          isSendTecode: false,
          isShowErrorMessage: false
        } as any
      )
      // console.log('receive', res)
    } catch (err) {
      console.error(err)
    }
    return res
  }

  stop() {
    window.clearInterval(this.timer as number)
    this.timer = null
    this.endtime = Date.now()
  }

  async getResult() {
    return new Promise(async (resolve, reject) => {
      this.timer = setInterval(async () => {
        const receiveRes = await this.receive()
        if (receiveRes?.data?.status === 'done') {
          this.stop()
          resolve(receiveRes)
        } else if (Date.now() - this.starttime >= this.duration) {
          this.stop()
          console.error(`${this.name} fail: timeout ${this.duration}`)
          resolve(null)
        }
      }, this.timelag)
    })
  }
}

type Location = {
  longitude: string
  latitude: string
  address?: string
  // [propName: string]: any;
} | null

// 微信小程序通过 syncdatasessionid 获取定位
const getLocationByMiniprogram = async (): Promise<Location> => {
  console.log('getLocationByMiniprogram start...')
  return new Promise(async (resolve, reject) => {
    const task = new MiniprogramTask('getLocation', {}, 30000)
    const res = await task.execute()
    // console.log('task.execute', res)
    const data = res?.data?.data ? JSON.parse(res.data.data) : null
    if (data?.status === 'success' && data?.data?.latitude) {
      const location = {
        latitude: data.data.latitude + '',
        longitude: data.data.longitude + '',
        address: data.data?.address || ''
      }
      if (location && !location.address) {
        location.address = (await getAddress(location)) || '经纬度获取成功，但地址获取失败。'
      }
      console.log('getLocationByMiniprogram end, value = ', location)
      resolve(location as any)
    } else {
      console.log('getLocationByMiniprogram end, value = ', null)
      resolve(null)
    }
  })
}

const linkToModuleByMiniprogram = async (params: IAny): Promise<null> => {
  console.log('linkToModuleByMiniprogram start...')
  return new Promise(async (resolve, reject) => {
    const task = new MiniprogramTask(
      'linkToModule',
      {
        modulekey: params.modulekey,
        indextag: params.indextag,
        query: params.query,
        litheformvisitdata: params.litheformvisitdata || null,
        title: params.title || ''
      },
      6000
    )
    await task.execute()
    console.log('linkToModuleByMiniprogram end')
    resolve(null)
  })
}

export { getLocationByMiniprogram, linkToModuleByMiniprogram }
