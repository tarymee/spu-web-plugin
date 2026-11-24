import { spuAxios } from '../axios'
import { axiosCache } from '../axios/axiosCache'
import { cloneDeep } from 'lodash-es'
import { globalOptions } from '../index'

let modulekey = ''
let customerid = ''
let customertype = ''

class SpuConfig {
  private isload = false

  cache: any[] = []

  private async getFun(): Promise<any> {
    if (!this.isload) {
      try {
        // const res = await spuAxios.post('/lifecycle/getconfigdata', {
        //   // modulekey: 'litheformspu'
        //   modulekey: modulekey,
        //   customerid: customerid,
        //   customertype: customertype
        // })

        const res = await axiosCache(
          {
            strategy: 'default',
            async checkcachesave(res: any) {
              return !!(res.code === 200 && res?.data?.configs)
            }
          },
          spuAxios,
          {
            url: '/lifecycle/getconfigdata',
            method: 'post',
            data: {
              // modulekey: 'litheformspu'
              modulekey: modulekey,
              customerid: customerid,
              customertype: customertype
            }
          }
        )

        // TODO 9.3.3后 res.data中增加extend字段记录额外的数据，也需要返回，这里需要做一个兼容的数据格式
        if (!res?.data?.configs) {
          res.data.configs = []
        }
        if (res?.data?.extend) {
          res.data.configs.push({
            descr: 'getconfigdata接口的extend字段信息',
            dataid: '__system_getconfigdata_extend',
            type: 'json',
            context: JSON.stringify(res?.data?.extend || {})
          })
        }
        // console.log(res)
        // debugger
        if (res.code === 200) {
          this.cache = res?.data?.configs || []
        }
      } catch (err) {
        console.error(err)
      }
      this.isload = true
    }
  }

  private getPro: any = null

  public async get(dataid?: string | string[]): Promise<any> {
    if (!this.isload) {
      // 兼容同时间发起多个
      if (!this.getPro) {
        this.getPro = this.getFun()
      }
      await this.getPro
    }

    if (dataid) {
      if (Array.isArray(dataid)) {
        return cloneDeep(
          this.cache.filter((item: any) => dataid.some((item2) => item2 === item.dataid))
        )
      } else {
        return cloneDeep(this.cache.find((item: any) => item.dataid === dataid))
      }
    } else {
      return cloneDeep(this.cache)
    }
  }

  // public async set (configs: any[]) {
  //   let isSaveSuccess = false

  //   configs.forEach((item: any) => {
  //     const index = this.cache.findIndex((item1: any) => item1.dataid === item.dataid)
  //     if (index >= 0) {
  //       this.cache[index] = item
  //     } else {
  //       this.cache.push(item)
  //     }
  //   })

  //   try {
  //     const initconfigRes = await spuAxios.post('/lifecycle/initconfig', {
  //       context: {
  //         // envid: selectEnv.conn.envid,
  //         // envname: selectEnv.conn.name,
  //         // tenantcode: tenantData.tenantcode,
  //         // modulecode: moduleData.modulecode,
  //         // modulekey: moduleData.modulekey,
  //         // modulename: moduleData.modulename,
  //         // versioncode: versionData.versioncode,
  //         // versionnum: versionData.versionnum,
  //         // serviceversion: ''
  //       },
  //       configs: this.cache,
  //       extend: {}
  //     })
  //     if (initconfigRes.code === 200) {
  //       const logRes = await spuAxios.post('/api/smartcenter/tenantModule/saveOpLog', {
  //         // envid: selectEnv.conn.envid,
  //         // tenantcode: tenantData.tenantcode,
  //         // versioncode: versionData.versioncode,
  //         // modulecode: moduleData.modulecode,
  //         logdatas: initconfigRes.data.logdatas,
  //         serviceversion: initconfigRes.data.serviceversion
  //       })
  //       if (logRes.code === 200) {
  //         isSaveSuccess = true
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   return isSaveSuccess
  // }
}

let spuConfig: any = null

function installSpuConfig() {
  modulekey = globalOptions.modulekey
  customerid = globalOptions.customerid
  customertype = globalOptions.customertype
  spuConfig = globalOptions.isspu ? new SpuConfig() : null
}

export { installSpuConfig, spuConfig }
