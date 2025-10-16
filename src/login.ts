import { get, cloneDeep } from 'lodash-es'
import jwtDecode from 'jwt-decode'
import { lsProxy } from './storageProxy'
import { axios } from './axios'
import cloudServ from './oss/cloudServ'
import core, { Module } from './core'
import { urlquery } from './urlquery'
import { getData, setData, removeData } from './storageCache'
import {
  setQueryEnvname,
  removeQueryEnvname,
  requestEnvdata,
  getEnvname,
  removeEnvdata,
  saveEnvdata,
  setTecode,
  removeTecode
} from './envService'
import { tenantSetting } from './tenantSetting'

type JwtResult = {
  LoginUser: IAny
  exp: number
} | null

function getToken() {
  const token = getData('token')
  // const token = lsProxy.getItem('token') as string
  return token
}

function setToken(value: string) {
  // console.log('setToken', value)
  // debugger
  setData('token', value)
}

function removeToken() {
  removeData('token')
}

function getTokenExpires() {
  return getData('tokenexpires')
  // return lsProxy.getItem('tokenexpires') as string
}

function setTokenExpires(value: string) {
  setData('tokenexpires', value)
}

function removeTokenExpires() {
  removeData('tokenexpires')
}

function getRefreshToken() {
  return getData('refreshtoken')
  // return lsProxy.getItem('refreshtoken') as string
}

function setRefreshToken(value: string) {
  setData('refreshtoken', value)
}

function removeRefreshToken() {
  removeData('refreshtoken')
}

function getUser(key?: string): any {
  const user = getData('user')
  const userObj = user ? JSON.parse(user) : null
  if (!key) {
    return userObj
  } else {
    return userObj ? userObj[key] || '' : ''
  }
}

function setUser(value: string | IAny) {
  let res
  if (typeof value === 'string') {
    res = JSON.parse(value)
  } else {
    res = cloneDeep(value)
  }

  for (const x in res) {
    res[x.toLowerCase()] = res[x]
  }

  setData('user', JSON.stringify(res))
}

function setUserByToken(token: string) {
  const user = getUserByToken(token)
  if (user) {
    setUser(user)
  } else {
    removeUser()
  }
}

function getUserByToken(token: string) {
  const jwtInfo = parseToken(token)
  if (jwtInfo && jwtInfo.LoginUser) {
    return jwtInfo.LoginUser
  } else {
    return null
  }
}

function removeUser() {
  removeData('user')
}

function parseToken(token?: string) {
  // debugger
  if (!token) {
    console.error('token为空 jwt解析token出错')
    return null
  }
  try {
    return jwtDecode<JwtResult>(token)
  } catch (e) {
    console.error('jwt解析token出错', token, e)
    return null
  }
}

// // 产品运营中心token
// const token = {
//   "LoginUser": {
//     "appId": "100",
//     "tenantCode": "1656652",
//     "productCode": "100000000000000000",
//     "productVersionCode": null,
//     "clientTypeCode": null,
//     "userCode": "6",
//     "accountCode": "6",
//     "username": "庄焕滨",
//     "tokenId": "bd69b4a4-5376-47cd-91c3-f1e1576440e5",
//     "appCodes": null,
//     "appCode": null,
//     "platRoleCodes": ["1637696814759153664"],
//     "metamodeltype": 2,
//     "orgCode": "1751852081616130048",
//     "centerRole": true
//   },
//   "TwoFactorAuthCode": "6f56da978dffe31a3b03a56c446f9467",
//   "exp": 1751694745
// }

// // 租户token
// const token = {
//   "exp": 1720161305,
//   "LoginUser": {
//     "accountInfoCode": "1803686723986010112",
//     "accountCode": "1803686724107644928",
//     "tenantCode": "3000911",
//     "productCode": "100000000000000000",
//     "productVersionCode": "30000000000000911",
//     "clientTypeCode": 1,
//     "tokenId": "8614059e-69a5-4e1e-a948-f2ef680d0dd5",
//     "orgCode": "1803686397149065216",
//     "userInfoId": "1806591894588108800",
//     "userInfoName": "woOUQJEAAAn4r5-7jffaxad6yotbEZ5A",
//     "positionCode": "1803686397304254473",
//     "positionName": "系统管理员-勿删",
//     "memberCode": "1806591894659411968",
//     "refPositionCode": "1300728614534385664",
//     "categoryCode": "",
//     "orgStructTypeId": "1",
//     "userName": null,
//     "userName1": "woOUQJEAAAn4r5-7jffaxad6yotbEZ5A",
//     "userName2": null,
//     "userName3": null,
//     "tenantName": "智慧100-企微版-V9.1.1开发租户",
//     "appCode": "sales",
//     "appCodes": [
//       "promotion",
//       "distribution",
//       "sales"
//     ],
//     "subPdCodes": [
//       "sfa",
//       "dms",
//       "pmm",
//       "tpm",
//       "ai"
//     ],
//     "codepath": "1.1803686395634921472.1803686397149065216.",
//     "isleaforg": "true",
//     "metamodeltype": 1,
//     "isSmsLogin": false
//   }
// }

// 查询token所属登录角色
// tenant: 普通租户登录 默认
// center: 产品运营中心登录 单点登录时只带 token 没带 refreshtoken 和 tokenexpires
function getRoleByToken(token?: string) {
  let loginRole: 'center' | 'tenant' = 'tenant' // center | tenant
  if (token) {
    const jwtInfo = parseToken(token)
    if (jwtInfo?.LoginUser?.centerRole) {
      // 产品运营中心登录
      loginRole = 'center'
    }
  }
  return loginRole
}

function getRole() {
  return getRoleByToken(getToken())
}

// 检测token是否过期
function checkLoginByToken(token?: string) {
  let haslogged = false
  if (token) {
    const jwtInfo = parseToken(token)
    if (jwtInfo?.exp) {
      haslogged = Number(jwtInfo.exp + '000') > Date.now()
    } else {
      haslogged = false
    }
  }
  return haslogged
}

// 检测当前用户是否登录状态
function checkLogin() {
  return checkLoginByToken(getToken())
  // return getLoginState().islogin
}

function getLoginState() {
  let role: 'center' | 'tenant' = 'tenant' // center | tenant
  let islogin = false
  // 0: 未登录 缓存中没有token refreshtoken tokenexpires
  // 1: 有登录过 缓存中有token refreshtoken tokenexpires token 过期 refreshtoken 过期
  // 2: 有登录过 缓存中有token refreshtoken tokenexpires token 过期 refreshtoken 未过期
  // 10: 有登录过 缓存中有token refreshtoken tokenexpires token 未过期 refreshtoken 未过期
  let type: 0 | 1 | 2 | 10 = 0

  const token = getToken()

  if (token) {
    role = getRoleByToken(token)
    if (role === 'center') {
      // 产品运营中心的token是永久的不会过期 且 没有 refreshtoken 和 tokenexpires
      islogin = checkLoginByToken(token)
      type = 10
    } else {
      const refreshtoken = getRefreshToken()
      const tokenexpires = getTokenExpires()
      const now = Date.now()

      if (refreshtoken && tokenexpires) {
        if (Number(tokenexpires) > now && checkLoginByToken(token)) {
          islogin = true
          type = 10
        } else {
          islogin = false
          if (checkLoginByToken(refreshtoken)) {
            type = 2
          } else {
            type = 1
          }
        }
      }
    }
  }

  return {
    role,
    islogin,
    type
  }
}

// 接口请求回来的 userInfo 有 functioncodes 以便做权限校验
// 有可能是中心角色请求失败 兼容不报错
async function getAndSetUserInfo() {
  try {
    const accountinfo = await axios
      .post('/api/teapi/rolepermission/account/getaccountinfo', {
        positionid: getUser('positioncode') || '',
        deviceinfo: '',
        sysversion: '',
        clientversion: ''
      })
      .then((res: any) => {
        if (res.code === 200 && res.data) {
          return res.data
        } else {
          return null
        }
      })
    if (accountinfo) {
      setUser(accountinfo)
    }
  } catch (e) {
    console.error(e)
    console.warn('获取用户信息失败，当前您登录的帐号可能为非标准租户帐号。')
  }
}

function formatTenant(tenant: ITenantInfo) {
  if (!tenant) {
    return null
  }
  const cloundTagMap = ['storage', 'storage-1d', 'storage-1y', 'storage-3m']
  const result: NormalizedCloudServ = {}
  for (const keyItem of cloundTagMap) {
    const cloudServ = tenant.cloudserv[keyItem as StorageEnum]
    if (cloudServ) {
      result[keyItem as StorageEnum] = {
        cloudserv_storage_provider: cloudServ.provider,
        cloudserv_storage_storagebucket: cloudServ.storagebucket,
        cloudserv_storage_storageendpoint: cloudServ.storageendpoint,
        cloudserv_storage_storageurl: cloudServ.storageurl,
        cloudserv_storage_accesskeyid: cloudServ.accesskeyid,
        cloudserv_storage_region: cloudServ.region
      }
    }
  }
  if (Object.keys(result).length === 0) {
    return null
  }
  return result
}

async function getAndSetTenant(tenantcode?: string) {
  try {
    const tenantsRes: null | ITenantInfo[] = await axios
      .get('/api/auth/tenantlist', {})
      .then((res: any) => {
        return res?.data?.tenants
      })

    let tenant: ITenantInfo | null = null
    if (tenantsRes?.length) {
      if (!tenantcode) {
        tenant = tenantsRes[0]
      } else {
        tenant = tenantsRes.find((item) => item.code === tenantcode) || null
      }
    }

    if (!tenant) {
      lsProxy.removeItem('tenant')
      cloudServ.remove()
    } else {
      lsProxy.setItem('tenant', JSON.stringify(tenant))
      const normalizedTenant = formatTenant(tenant)
      if (normalizedTenant) {
        cloudServ.set(normalizedTenant)
      }
    }
  } catch (e) {
    console.error(e)
    console.warn('获取租户信息失败，当前您登录的帐号可能为非标准租户帐号。')
  }
}

function updateToken() {
  const loginState = getLoginState()

  if (!loginState.islogin && loginState.type <= 1) {
    console.warn('当前未登录/token过期，不支持自动刷新token。')
    return false
  }

  if (loginState.role === 'center') {
    console.warn('当前登录为产品运营中心用户，不支持自动刷新token。')
    return false
  }

  const token = getToken()
  const refreshtoken = getRefreshToken()
  const sendToken = checkLoginByToken(token) ? token : refreshtoken
  return axios
    .get('/api/auth/refreshtoken', {
      params: {
        refreshtoken: sendToken
      },
      isShowLoading: false,
      isShowErrorMessage: false,
      isSendToken: false,
      isSendTecode: true,
      headers: {
        token: sendToken
      }
    })
    .then((res: any) => {
      // console.log(res)
      const data = res?.data
      if (data) {
        setToken(data.token)
        setRefreshToken(data.refreshtoken)
        setTokenExpires(data.tokenexpires)
      }
    })
}

let refreshtokenTimer: number | null = null

function startRefreshtoken() {
  const loginState = getLoginState()
  // 如果是产品运营中心 则不走刷新token流程
  if (loginState.role === 'center') {
    console.warn('当前登录为产品运营中心用户，不支持自动刷新token。')
    return false
  }

  // stopRefreshtoken()
  clearTimeout(refreshtokenTimer as number)
  refreshtokenTimer = null

  // 如果有登录 但 refreshtoken 不是完整 token 则10秒后【需要等单点登录走完后才刷新不然会被覆盖】刷新一次取到完整 token
  // 如果有登录 且 refreshtoken 是完整 token 如果剩余时间大于10分钟 则每隔10分钟刷一次 否则过期前15秒更新 token
  // 如果没登录 每隔10秒走token更新逻辑(如果刚开始没登录 后面才登录【不需要再在登陆后写刷新token逻辑】)
  let time = 0
  if (loginState.islogin) {
    const user = getUserByToken(getRefreshToken())
    if (user?.tokenId) {
      time = Number(getTokenExpires()) - Date.now() - 1000 * 15
      // 如果剩余时间大于10分钟 则每隔10分钟刷一次
      if (time > 600000) {
        time = 600000
      } else if (time < 0) {
        time = 0
      }
    } else {
      time = 10000
    }
  } else {
    if (loginState.type === 2) {
      time = 0
    } else {
      // console.error('未登录，10秒后尝试更新token')
      time = 30000
    }
  }
  // time = 5000
  refreshtokenTimer = window.setTimeout(async () => {
    if (getLoginState().type >= 2) {
      await updateToken()
    }
    startRefreshtoken()
  }, time)
}

// 获取 spu 容器 token
const getSPUContainerToken = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (window.aPaaS?.getToken) {
      window.aPaaS.getToken((res: any) => {
        console.log('window.aPaaS.getToken success', res)
        // 安卓返回 token tokenExpires refreshToken
        // ios返回 token tokenexpires refreshtoken
        // 改好按安卓

        const token = res?.token
        const tokenexpires = res?.tokenExpires || res?.tokenexpires
        const refreshtoken = res?.refreshToken || res?.refreshtoken

        if (token && tokenexpires && refreshtoken) {
          resolve({
            token,
            tokenexpires,
            refreshtoken
          })
        } else {
          console.error('window.aPaaS.getToken fail')
          resolve(null)
        }
      })
    } else {
      console.warn('window.aPaaS.getToken fail: not in SPU container')
      resolve(null)
    }
  })
}

// 如果APP端在SPU页面切到后台 然后又切回前台 有可能发生
// 1、切后台时间过长导致 token 过期
// 2、切后台后打开太多别的应用 导致切回前台时内存不足 从而导致 SPU 的 webview reload
// 如果 1 2 同时发生 那么当前SPU页面重走单点登录流程 而url上的token已经过期 会导致单点登录失败
// 因此 在APP端 单点登录不使用url上的token 而是直接拿App端的 App端能保证拿到的token一直不过期
const fixLoginQuery = async (query: IAny) => {
  const newQuery = cloneDeep(query)
  const type = await Module.getSpuContainerType()
  if (type === 'app' && window.aPaaS?.getToken) {
    console.log('SPU is in App, singleLogin use App token.')
    const tokenData = await getSPUContainerToken()
    if (tokenData) {
      newQuery.token = tokenData.token
      newQuery.tokenexpires = tokenData.tokenexpires
      newQuery.refreshtoken = tokenData.refreshtoken
    }
  } else {
    console.log('SPU is not in App, singleLogin use query token.')
  }
  return newQuery
}

// 修复 App 切到后台时间过长导致 token 过期
// 监听 App 切换到前台 判断token是否过期 如果过期就调用获取tokne方法更新token
const fixAppTokenExpired = () => {
  if (window.Native?.onHostEnterForceground) {
    console.log('listen App enter forceground')
    window.Native.onHostEnterForceground(async () => {
      console.log('App enter forceground')
      const loginState = getLoginState()
      if (!loginState.islogin && loginState.type === 2 && loginState.role !== 'center') {
        const tokenData = await getSPUContainerToken()
        if (tokenData) {
          setToken(tokenData.token)
          setRefreshToken(tokenData.refreshtoken)
          setTokenExpires(tokenData.tokenexpires)
        } else {
          try {
            await updateToken()
          } catch (err) {
            console.error(err)
          }
        }
      }
    })
  }
}

// 单点登录
async function singleLogin(query: IAny) {
  query = await fixLoginQuery(query)

  let flag = false // 是否登录成功
  const token = query.token
  const refreshtoken = query.refreshtoken
  const tokenexpires = query.tokenexpires
  const envname = query.envname
  const context = query.context

  function setBaseInfo() {
    setToken(token)
    setUserByToken(token) // 解析token为用户信息存入
    refreshtoken ? setRefreshToken(refreshtoken) : removeRefreshToken()
    tokenexpires ? setTokenExpires(tokenexpires) : removeTokenExpires()
    envname ? setQueryEnvname(envname) : removeQueryEnvname()
    // context 上下文字段 产品运营中心安装 卸载 配置 和 产品配置中心业务配置 页面需要用到
    // web 端有传 app没传 需要做兼容
    context && lsProxy.setItem('context', decodeURIComponent(context))
  }

  if (checkLoginByToken(token)) {
    let isneedlogin = true // 是否需要走单点登录流程
    const loginRole = getRoleByToken(token)

    if (loginRole === 'center') {
      // 如果本地已经登录 且 query 登录参数与本地一致 说明是刚登录没多久【token也没刷新过】 视为已经登录 不需再走单点登录流程
      // 之所以不强制校验 refreshtoken tokenexpires 是因为安装卸载配置页面有可能放在产品运营中心 没有这两字段
      if (checkLogin() && token === getToken()) {
        isneedlogin = false
        flag = true
      }
    } else {
      // 如果本地已经登录 且 query 登录参数与本地一致 说明是刚登录没多久【token也没刷新过】 视为已经登录 不需再走单点登录流程
      if (
        checkLogin() &&
        token === getToken() &&
        refreshtoken === getRefreshToken() &&
        tokenexpires === getTokenExpires()
      ) {
        isneedlogin = false
        flag = true
      }
    }
    // isneedlogin = true
    // debugger

    if (isneedlogin) {
      setBaseInfo()

      // 单点登录写入 token 之后
      // 1、如果 refreshtoken 不完整 则换取完整的 refreshtoken
      try {
        if (checkLogin()) {
          const refreshTokenUser = getUserByToken(getRefreshToken())
          const tokenUser = getUserByToken(getToken())
          if (!refreshTokenUser?.tokenId && tokenUser?.tokenId) {
            await updateToken()
          }
        }
      } catch (err) {
        console.error(err)
      }
      // 2、重新计算刷新 token 时间 因为刚开始进入就 startRefreshtoken 检测到没有 token 会过10秒才执行刷新 token 操作
      startRefreshtoken()

      // 获取环境信息和租户配置信息
      const nowEnvname = await getEnvname()
      if (nowEnvname) {
        const envData = await requestEnvdata(nowEnvname)
        // debugger
        if (envData) {
          saveEnvdata(envData)
          if (envData.tenantcode) {
            setTecode(envData.tenantcode)
            // 租户配置
            await tenantSetting.requestAndSetTenantSetting(envData.tenantcode)
          } else {
            tenantSetting.removeTenantSetting()
            removeTecode()
          }
        } else {
          removeEnvdata()
          removeTecode()
        }
      } else {
        removeEnvdata()
        removeTecode()
      }

      await getAndSetTenant()
      await getAndSetUserInfo()

      // 单点登录后 获取 web 开发者模式 如果是则设置 isdebugger
      urlquery.dealWebDebugger()

      flag = true
    }
  } else {
    flag = false
    setBaseInfo() // 传递的token过期依然写入 如果不写入的话 有可能之前的token本来没过期 页面依然可用
    console.error('单点登录失败，请检查链接所传 token/refreshtoken/tokenexpires 是否非法或过期。')
  }

  // 登录成功之后 获取spu信息
  if (flag) {
    await core.initGetData()
  }

  if (flag) {
    // 单点登录成功 需要删除 query 中相关参数
    token && delete query.token
    refreshtoken && delete query.refreshtoken
    tokenexpires && delete query.tokenexpires
    envname && delete query.envname
    context && delete query.context
  }

  return {
    flag,
    query
  }
}

function installAuth(options: any) {
  startRefreshtoken()
  fixAppTokenExpired()
  if (options.router) {
    options.router.beforeEach(async (to: any, from: any, next: any) => {
      // console.log(from)
      // console.log(to)
      // const isInitVisit = from.path === '/' && from.name === undefined // 路由初始化访问
      // console.log('isInitVisit', isInitVisit)

      // 自动登录
      if (to.query.token) {
        const singleLoginRes = await singleLogin(to.query)
        if (singleLoginRes.flag) {
          // next()
          next({
            path: to.path,
            params: to.params,
            query: singleLoginRes.query
          })
        } else {
          next()
        }
        options.singleLoginCallback && options.singleLoginCallback(singleLoginRes)
      } else {
        next()
      }
    })
  } else {
    console.warn(
      '@smart100/spu-web-plugin 需要传入一个 vue-router 实例以便执行单点登录逻辑，如果您没传 vue-router 实例则需要自行在合适的位置执行单点登录代码，如果您已自行实现，请忽略该提示。'
    )
  }

  if (checkLogin()) {
    core.initGetData()
  }
}

export {
  installAuth,
  getToken,
  // setToken,
  // removeToken,
  getTokenExpires,
  // setTokenExpires,
  // removeTokenExpires,
  getRefreshToken,
  // setRefreshToken,
  // removeRefreshToken,
  updateToken,
  // startRefreshtoken,
  getUser,
  // setUser,
  getRole,
  // removeUser,
  // getUserByToken,
  // setUserByToken,
  checkLogin,
  getLoginState,
  // checkLoginByToken,
  singleLogin
}
