import { globalOptions } from './index'
import { axios } from './axios'
import { get, cloneDeep } from 'lodash-es'
import { urlquery } from './urlquery'
import { getToken, getUser, getRefreshToken, getTokenExpires } from './login'
import { getEnvname, getEnvdata } from './envService'

class Core {
  loadStatus = 0 // 0未开始 1正在加载 2加载完成

  cache = {
    envName: '',
    envData: null,
    tenantCode: '',
    webDefineData: null
  }

  // isinit = false
  // async init() {
  //   if (this.isinit) return
  //   this.cache.tenantCode = getUser('tenantcode') || ''
  //   this.cache.envName = await getEnvname()
  //   this.cache.envData = await getEnvdata()
  //   this.cache.webDefineData = await this.requestWebDefineData()
  //   this.isinit = true
  // }

  // async getCache() {
  //   if (this.isinit) {
  //     return this.cache
  //   } else {
  //     await this.init()
  //     return this.cache
  //   }
  // }

  requestDataPromise = null

  async initGetData() {
    const nowEnvname = await getEnvname()
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

  // 请求实时G3数据
  async requestData() {
    const nowEnvname = await getEnvname()
    const nowTenantCode = getUser('tenantcode') || ''
    this.cache.envName = nowEnvname
    this.cache.tenantCode = nowTenantCode
    this.cache.envData = await getEnvdata()
    this.cache.webDefineData = await this.requestWebDefineData()
    return this.cache
  }

  async requestWebDefineData() {
    const envId = this.cache.envData?.envid
    const tenantCode = this.cache.tenantCode
    const smartcenter = this.cache?.envData?.smartcenter
    let result = null
    if (envId && tenantCode && smartcenter) {
      // debugger
      let res
      try {
        res = await axios.post(
          `${smartcenter}/api/smartcenter/biz/getTenantWebAndApiDefined`,
          {
            envid: envId,
            tenantcode: tenantCode
          },
          {
            isShowLoading: false
          }
        )
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

  async getEnvData() {
    const res = {
      errorMsg: '',
      data: null
    }
    const data = await this.initGetData()
    if (!data.envName) {
      res.errorMsg = '找不到租户环境名称，请检查登录时是否有填写企业名称。'
    } else if (!data.envData) {
      res.errorMsg = '找不到租户环境信息。'
    } else {
      res.data = data.envData
    }
    return res
  }

  async getEnvBusiness() {
    let business = ''
    const envData = await this.getEnvData()
    if (envData.data) {
      business = envData.data.business
    }
    return business
  }

  async getModuleData(modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    const res = {
      errorMsg: '',
      data: null
    }
    const data = await this.initGetData()
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

  getModuleDataSync(modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    const res = {
      errorMsg: '',
      data: null
    }
    const data = this.cache
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

  async getContext(modulekey) {
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

  getContextSync(modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    let context
    const moduleData = this.getModuleDataSync(modulekey)
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

  async getModuleBusiness(modulekey) {
    let business = ''
    const moduleData = await this.getModuleData(modulekey)
    if (moduleData.data) {
      const envBusiness = await this.getEnvBusiness()
      business = `${moduleData.data.address || envBusiness}`
    }
    return business
  }

  async checkModule(modulekey) {
    if (!modulekey) {
      modulekey = globalOptions.modulekey
    }
    const moduleData = await this.getModuleData(modulekey)
    return !!moduleData.data
  }

  checkPermission(params) {
    let modulekey = params?.modulekey || globalOptions.modulekey
    const moduleData = this.getModuleDataSync(modulekey)
    return !!moduleData.data
  }

  getQueryUrl(query, queryvalue = {}) {
    query = cloneDeep(query)
    if (urlquery.isdebugger) {
      query.every((item) => item === '')
      const isdebuggerQuery = query.find((item) => item.key === 'isdebugger')
      if (isdebuggerQuery) {
        isdebuggerQuery.value = '1'
      } else {
        query.push({
          key: 'isdebugger',
          value: '1',
          field_type: ''
        })
      }
      queryvalue && (queryvalue.isdebugger = '1')
    }

    const buildInMap = {
      '${token}': getToken(), // eslint-disable-line no-template-curly-in-string
      '${refreshtoken}': getRefreshToken(), // eslint-disable-line no-template-curly-in-string
      '${tokenexpires}': getTokenExpires(), // eslint-disable-line no-template-curly-in-string
      '${envname}': this.cache.envName || '' // eslint-disable-line no-template-curly-in-string
    }

    if (queryvalue) {
      queryvalue = cloneDeep(queryvalue)
      for (const x in queryvalue) {
        if (x.indexOf('${') === 0) {
          buildInMap[x] = queryvalue[x]
          delete queryvalue[x]
        }
      }
    }

    let url = ''
    query &&
      query.length &&
      query.forEach((item) => {
        let value = ''
        if (item.value.indexOf('${') === 0) {
          const buildInValue = buildInMap[item.value]
          value = typeof buildInValue !== 'undefined' ? buildInValue : ''
        } else {
          value = typeof item.value !== 'undefined' ? item.value : ''
        }
        if (queryvalue && typeof queryvalue[item.key] !== 'undefined') {
          value = queryvalue[item.key]
        }
        url += `${item.key}=${value}&`
      })
    return url
  }

  // pagecode: 'modulekey:indextag'
  async createWebUrl(modulekey, indextag, queryvalue = {}) {
    let url = ''
    let errorMsg = ''
    let indextagData

    const moduleData = await this.getModuleData(modulekey)
    if (moduleData.data) {
      if (!indextag) {
        errorMsg = '缺少 indextag，请检查。'
      } else {
        indextagData = (moduleData.data.protocol.indexs || []).find((item) => item.indextag === indextag)
        if (indextagData) {
          const queryUrl = this.getQueryUrl(indextagData.query || [], queryvalue)
          const context = await this.getContext(modulekey)
          const moduleBusiness = await this.getModuleBusiness(modulekey)
          if (indextagData.externalurl) {
            url = `${indextagData.externalurl}`
          } else if (indextagData.url) {
            url = `${moduleBusiness}/${indextagData.url}`
          } else {
            url = `${moduleBusiness}/${moduleData.data.modulekey}/${moduleData.data.moduleversion}${
              indextagData.path.indexOf('/') === 0 ? '' : '/'
            }${indextagData.path}${indextagData.location}`
          }

          if (url.indexOf('?') === -1) {
            url += `?${queryUrl}indextag=${indextag}&context=${encodeURIComponent(JSON.stringify(context))}`
          } else {
            url += `&${queryUrl}indextag=${indextag}&context=${encodeURIComponent(JSON.stringify(context))}`
          }
        } else {
          errorMsg = `找不到 indextag = ${indextag} 的页面信息。`
        }
      }
    } else {
      errorMsg = moduleData.errorMsg
    }
    return {
      url,
      // indextagData,
      errorMsg
    }
  }

  getIndextagSync(params) {
    const result = {
      code: '',
      msg: '',
      indextag: ''
    }

    if (params.url) {
      const a = params.url.split('indextag=')
      if (a.length > 1) {
        const b = a[1].split('&')
        result.code = 200
        result.indextag = b[0]
        result.msg = '解析成功。'
      } else {
        result.code = 404
        result.msg = '不存在该 url 的 indextag。'
      }
    } else {
      result.code = 404
      result.msg = '传入 url 为空。'
    }
    // console.log(result)
    // debugger
    // params.complete && params.complete(result.code, result.indextag, result.msg)
    return result
  }

  // : Promise<'h5' | 'web' | 'app' | 'smartcenter' | 'smartconfigurationcenter' | ''>
  async getSpuContainerType() {
    // 只有app端才提供原生拍照能力
    if (window?.aPaaS?.getPhoto) {
      return 'app'
    } else if (window?.Module?.spuContainerType) {
      return window.Module.spuContainerType
    } else {
      return ''
    }
  }
}

const core = new Core()

const Module = {
  getModuleData: core.getModuleData.bind(core),
  getEnvname: getEnvname,
  getEnvData: core.getEnvData.bind(core),
  checkModule: core.checkModule.bind(core),
  createWebUrl: core.createWebUrl.bind(core),
  getSpuContainerType: core.getSpuContainerType.bind(core)
}

export { core as default, Module }
