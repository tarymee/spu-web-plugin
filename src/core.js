import { globalOptions } from './install'
import { get, cloneDeep } from 'lodash-es'
import { apaasAxios as axios } from './axios'
import login from './login'

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
    const nowEnvname = await login.getEnvname()
    const nowTenantCode = login.getUser('tenantcode') || ''
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
      const list = get(res, 'data.list')
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
    const nowEnvname = await login.getEnvname()
    const nowTenantCode = login.getUser('tenantcode') || ''
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
    const moduleData = await this.getModuleData(modulekey)
    return !!moduleData.data
  }

  // pagecode: 'modulekey:indextag'
  async createWebUrl (modulekey, indextag, queryvalue = {}) {
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
          const queryUrl = await this.getQueryUrl(indextagData.query || [], queryvalue)
          const context = await this.getContext(modulekey)
          const moduleBusiness = await this.getModuleBusiness(modulekey)
          if (indextagData.externalurl) {
            url = `${indextagData.externalurl}`
          } else if (indextagData.url) {
            url = `${moduleBusiness}/${indextagData.url}`
          } else {
            url = `${moduleBusiness}/${moduleData.data.modulekey}/${moduleData.data.moduleversion}/${indextagData.path}${indextagData.location}`
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
      indextagData,
      errorMsg
    }
  }

  // pagecode: 'modulekey:indextag'
  async createRouteUrl (modulekey, indextag, queryvalue) {
    // &moduletype=${category === '1000' ? 'scene' : 'spu'}
    // console.log(modulekey, indextag, queryvalue)
    // debugger
    if (!queryvalue) {
      return `/module?modulekey=${modulekey}&indextag=${indextag}`
    } else {
      return `/module?modulekey=${modulekey}&indextag=${indextag}&queryvalue=${encodeURIComponent(JSON.stringify(queryvalue))}`
    }
  }

  async getQueryUrl (query, queryvalue = {}) {
    const data = await this.getData()
    const buildInMap = {
      '${token}': login.getToken(), // eslint-disable-line no-template-curly-in-string
      '${refreshtoken}': login.getRefreshToken(), // eslint-disable-line no-template-curly-in-string
      '${tokenexpires}': login.getTokenExpires(), // eslint-disable-line no-template-curly-in-string
      '${envname}': data.envName || '' // eslint-disable-line no-template-curly-in-string
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
    query && query.length && query.forEach((item) => {
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

  async createApi (modulekey, apitag) {
    let apiUrl = ''
    let errorMsg = ''
    let apitagData

    const moduleData = await this.getModuleData(modulekey)
    if (moduleData.data) {
      if (!apitag) {
        errorMsg = '缺少 apitag，请检查。'
      } else {
        apitagData = (moduleData.data.apiprotocol.apis || []).find((item) => item.apitag === apitag)
        if (apitagData) {
          if (apitagData.status === '1') {
            const moduleBusiness = await this.getModuleBusiness(modulekey)
            apiUrl = `${moduleBusiness}/api/${moduleData.data.modulekey}/${moduleData.data.moduleversion}/${apitagData.path}`
          } else {
            errorMsg = `apitag = ${apitag} 的 api 已停用。`
          }
        } else {
          errorMsg = `找不到 apitag = ${apitag} 的 api 信息。`
        }
      }
    } else {
      errorMsg = moduleData.errorMsg
    }

    return {
      apiUrl,
      apitagData,
      errorMsg
    }
  }

  async getApiOrigin (modulekey) {
    let apiOrigin = ''
    let errorMsg = ''
    const moduleData = await this.getModuleData(modulekey)
    if (moduleData.data) {
      const moduleBusiness = await this.getModuleBusiness(modulekey)
      apiOrigin = `${moduleBusiness}/api/${moduleData.data.modulekey}/${moduleData.data.moduleversion}/`
    } else {
      errorMsg = moduleData.errorMsg
    }
    return {
      apiOrigin,
      errorMsg
    }
  }


  // Module.apiRequest({
  //   modulekey: 'demospu',
  //   apitag: 'pagelist',
  //   body: {
  //     pageindex: '1',
  //     pagesize: '1',
  //     status: '',
  //     name: ''
  //   },
  //   complete: (code, data, msg) => {
  //     if (code === 200) {
  //       console.log(data)
  //     } else {
  //       throw Error(msg)
  //     }
  //   }
  // })
  async apiRequest (params) {
    // debugger
    // params.modulekey = 'ss'

    const result = {
      code: '',
      msg: '',
      data: null
    }

    const apiData = await this.createApi(params.modulekey, params.apitag)
    // if (apiData.errorMsg) throw new Error(apiData.errorMsg)
    if (apiData.errorMsg) {
      result.code = 404
      result.msg = apiData.errorMsg
    } else {
      if (apiData.apitagData.method === 'POST') {
        // todo 校验 body
        try {
          const res = await axios.post(`${apiData.apiUrl}`, params.body, {
            isShowErrorMessage: false
          })
          if (res?.data?.code === 200) {
            result.code = 200
            result.msg = res?.data?.msg || '请求成功。'
            result.data = res?.data?.data
          } else {
            result.code = res?.data?.code || 404
            result.msg = res?.data?.msg || '网络异常，请稍后重试。'
          }
        } catch (err) {
          result.code = err?.response?.data?.code || err?.response?.status || 404
          result.msg = err?.response?.data?.msg || err?.response?.statusText || '网络异常，请稍后重试。'
        }
      } else {
        result.code = 404
        result.msg = '暂不支持除了 POST 以外的其他方法'
      }
    }

    params.complete && params.complete(result.code, result.data, result.msg)
    return result
  }
}


const core = new Core()




const Module = {
  // getContextSync () {
  //   return core.getContext(modulekey)
  // },
  // linkToPage: core.linkToPage.bind(core),
  // linkToModule: core.linkToModule.bind(core),
  apiRequest: core.apiRequest.bind(core),
  checkModule: core.checkModule.bind(core)
}





export default core



export {
  Module
}

