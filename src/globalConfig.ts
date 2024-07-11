import { axios } from './index'
import { cloneDeep } from 'lodash-es'

class GlobalConfig {
  private isload = false

  cache: any[] = []

  public async getFun (): Promise<any> {
    if (!this.isload) {
      try {
        const res = await axios.post('/api/pemission/rolepermission/globalconfig/getglobalconfigbytype', {
          configtype: '1'
        })
        // console.log(res)
        // debugger
        if (res.code === 200) {
          this.cache = res?.data || []
        }
      } catch (err) {
        console.error(err)
      }
      this.isload = true
    }
  }

  private getPro: any = null

  public async get (key?: string | string[]): Promise<any> {
    if (!this.isload) {
      // 兼容同时间发起多个
      if (!this.getPro) {
        this.getPro = this.getFun()
      }
      await this.getPro
    }

    if (key) {
      if (Array.isArray(key)) {
        return cloneDeep(this.cache.filter((item: any) => (key.some((item2) => item2 === item.key))))
      } else {
        return cloneDeep(this.cache.find((item: any) => item.key === key))
      }
    } else {
      return cloneDeep(this.cache)
    }
  }
}

const globalConfig = new GlobalConfig()

export {
  globalConfig
}
