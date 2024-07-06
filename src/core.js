import { globalOptions, axios, getUser, Module } from './index'
import { get } from 'lodash-es'

const urlIsIp = (url) => {
  const hostname = url.split('://')[1].split(':')[0].split('/')[0]
  const arr = hostname.split('.')
  if (arr.length !== 4) return false
  let flag = true
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!Number.isInteger(Number(arr[i]))) {
      flag = false
      break
    }
  }
  return flag
}

// 如果是非ip地址 则切换为与主页面一样的 location.protocol 前缀
const toggleHttpOrHttps = (url) => {
  let res = url
  if (!urlIsIp(res)) {
    if (!res.startsWith(location.protocol)) {
      const arr = res.split('//')
      arr[0] = location.protocol
      res = arr.join('//')
    }
  }
  return res
}

class Core {
  loadStatus = 0 // 0未开始 1正在加载 2加载完成

  cache = {
    envName: '',
    envData: null,
    tenantCode: '',
    webDefineData: null
  }

  clearCache () {
    this.loadStatus = 0
    this.cache = {
      envName: '',
      envData: null,
      tenantCode: '',
      webDefineData: null
    }
    this.requestDataPromise = null
  }

  // 请求实时G3数据
  async requestData () {
    const nowEnvname = await Module.getEnvname()
    const nowTenantCode = getUser('tenantcode') || ''
    this.cache.envName = nowEnvname
    this.cache.tenantCode = nowTenantCode
    this.cache.envData = await this.requestEnvData(nowEnvname)
    this.cache.webDefineData = await this.requestWebDefineData()
    return this.cache
  }

  async requestEnvData (envName) {
    // envName = '产品运营中心验证'
    let result = null
    if (envName) {
      const hostsRoot = document.location.protocol === 'https:' ? 'https://mconfig.xtion.net' : 'http://mconfig.xtion.net:8015'
      let response
      try {
        response = await axios.get(`${hostsRoot}/multiplatconfig/env/${envName}`, {
          isShowLoading: false,
          isSendToken: false
        })
        // console.log(response)
        // debugger
        result = get(response, 'data.0')

        // 如果是非ip地址 则切换为与主页面一样的 location.protocol 前缀
        result?.business && (result.business = toggleHttpOrHttps(result.business))
        result?.smartcenter && (result.smartcenter = toggleHttpOrHttps(result.smartcenter))
      } catch (err) {
        console.error(err)
      }
    }
    return result
  }

  async requestWebDefineData () {
    const envId = this.cache.envData?.envid
    const tenantCode = this.cache.tenantCode
    const smartcenter = this.cache?.envData?.smartcenter
    let result = null
    if (envId && tenantCode && smartcenter) {
      // debugger
      let res
      try {
        res = await axios.post(`${smartcenter}/api/smartcenter/biz/getTenantWebAndApiDefined`, {
          envid: envId,
          tenantcode: tenantCode
        }, {
          isShowLoading: false
        })
      } catch (err) {
        console.error(err)
      }
      // console.log(res)
      // debugger
      const list = res?.data?.list || []
      if (list && list.length) {
        const usedList = list.filter((item) => item.status === 1)
        usedList.forEach((item) => {
          if (item.protocol) {
            try {
              item.protocol = JSON.parse(item.protocol)
            } catch (err) {
              console.error(err)
            }
          }
          if (item.apiprotocol) {
            try {
              item.apiprotocol = JSON.parse(item.apiprotocol)
            } catch (err) {
              console.error(err)
            }
          }
        })
        result = usedList
      }
    }
    return result
  }

  requestDataPromise = null
  async getData () {
    const nowEnvname = await Module.getEnvname()
    const nowTenantCode = getUser('tenantcode') || ''
    // console.log(tenantCode)
    if (this.cache.envName === nowEnvname && this.cache.tenantCode === nowTenantCode && this.loadStatus === 2) {
      return this.cache
    }

    // 兼容同时间发起多个
    if (this.loadStatus === 1 && this.requestDataPromise) {
      // console.error(2122)
      // console.log(this.requestDataPromise)
      // debugger
      return this.requestDataPromise
    }

    this.loadStatus = 1
    this.requestDataPromise = this.requestData()
    await this.requestDataPromise
    this.loadStatus = 2
    return this.cache
  }

  async getEnvData () {
    const res = {
      errorMsg: '',
      data: null
    }
    const data = await this.getData()
    if (!data.envName) {
      res.errorMsg = '找不到租户环境名称，请检查登录时是否有填写企业名称。'
    } else if (!data.envData) {
      res.errorMsg = '找不到租户环境信息。'
    } else {
      res.data = data.envData
    }
    return res
  }

  async getEnvBusiness () {
    let business = ''
    const envData = await this.getEnvData()
    if (envData.data) {
      business = envData.data.business
    }
    return business
  }

  async getModuleData (modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    const res = {
      errorMsg: '',
      data: null
    }
    const data = await this.getData()
    if (!modulekey) {
      res.errorMsg = '缺少 modulekey，请检查。'
    } else if (!data.envName) {
      res.errorMsg = '找不到租户环境名称，请检查登录时是否有填写企业名称。'
    } else if (!data.envData) {
      res.errorMsg = '找不到租户环境信息。'
    } else if (!data.webDefineData) {
      res.errorMsg = '该租户没有部署 G3。'
    } else if (!data.webDefineData.length) {
      res.errorMsg = '该租户没有授权场景模块/SPU模块。'
    } else {
      res.data = data.webDefineData.find((item) => item.modulekey === modulekey)
      if (!res.data) {
        res.errorMsg = `该租户没有授权 ${modulekey} 模块。`
      }
    }
    return res
  }

  async getContext (modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    let context
    const moduleData = await this.getModuleData(modulekey)
    if (moduleData?.data) {
      context = {
        envid: moduleData.envid || '',
        envname: this.cache.envName || '',
        tenantcode: moduleData.tenantcode || '',
        modulecode: moduleData.modulecode || '',
        modulekey: moduleData.modulekey || '',
        modulename: moduleData.modulename || '',
        moduleversion: moduleData.moduleversion || '',
        versioncode: moduleData.versioncode || '',
        versionnum: moduleData.moduleversion || ''
      }
    }
    return context
  }

  async getModuleBusiness (modulekey) {
    let business = ''
    const moduleData = await this.getModuleData(modulekey)
    if (moduleData.data) {
      const envBusiness = await this.getEnvBusiness()
      business = `${moduleData.data.address || envBusiness}`
    }
    return business
  }

  async checkModule (modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    const moduleData = await this.getModuleData(modulekey)
    return !!moduleData.data
  }
}

const core = new Core()

export default core
