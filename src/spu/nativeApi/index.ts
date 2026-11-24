import { isInMiniProgram, getUniqueid, getQueryByUrl, importJS } from '../../utils'
import { set, get } from 'lodash-es'
import { globalOptions } from '../../index'
import spuManager from '../manager'
import { getUser, getToken, getTokenExpires, getRefreshToken } from '../../auth/login'
import { getEnvname } from '../../auth/envService'
import { getLocationByMiniprogram, linkToModuleByMiniprogram } from './miniprogramBridge'
import { spuAxios } from '../../axios'

function miniProgramInitCallback(callback: Function) {
  if (!window.WeixinJSBridge || !window.WeixinJSBridge?.invoke) {
    document.addEventListener(
      'WeixinJSBridgeReady',
      () => {
        if (isInMiniProgram()) {
          callback && callback()
        }
      },
      false
    )
  } else {
    if (isInMiniProgram()) {
      callback && callback()
    }
  }
}

class NativeApi {
  client: string = ''
  private isLoadWeixinSDK = false
  private _events: Map<string, number> = new Map()
  Module: IAny = {}
  Native: IAny = {}
  aPaaS: IAny = {}

  constructor(client: string) {
    this.client = client
    this.createBaseApi()
    this.createClientApi()
  }

  createBaseApi() {
    this.Module.getContextSync = () => {
      return spuManager.getContextSync(globalOptions.modulekey)
    }
    this.Module.checkPermission = spuManager.checkPermission.bind(spuManager)
    this.Module.getIndextagSync = spuManager.getIndextagSync.bind(spuManager)

    this.aPaaS.getUserInfoSync = getUser
    this.aPaaS.getToken = (callback: any) => {
      callback &&
        callback({
          token: getToken(),
          tokenExpires: getTokenExpires(),
          refreshToken: getRefreshToken()
        })
    }
  }

  createClientApi() {
    const that = this
    this.Module.spuContainerType = this.client
    if (this.client === 'miniprogram') {
      if (!this.isLoadWeixinSDK) {
        importJS('//res.wx.qq.com/open/js/jweixin-1.3.2.js').finally(() => {
          this.isLoadWeixinSDK = true
        })
      }
      this.Module.linkToModule = (params: IAny) => {
        // linkToModuleByMiniprogram(params)
        console.log('linkToModule', params)

        if (!window.wx?.miniProgram?.navigateTo) {
          console.error('不存在 window.wx.miniProgram.navigateTo，无法跳转')
          return
        }

        const mode = params.mode || 'push'
        if (params.pagesize) {
          console.error('小程序端不支持 pagesize 属性，请移除此定义。')
          return
        } else if (mode !== 'push') {
          console.error(`暂不支持 ${mode} 模式`)
          return
        }

        const { modulekey, indextag, query, title, litheformvisitdata } = params
        const routeUrl = `/packageCOM/pages/module/index?modulekey=${modulekey}&indextag=${indextag}${
          query ? '&queryvalue=' + encodeURIComponent(JSON.stringify(query)) : ''
        }${litheformvisitdata ? '&litheformvisitdata=' + litheformvisitdata : ''}&pagetitle=${title || ''}`

        // console.log(routeUrl)
        window.wx.miniProgram.navigateTo({
          url: routeUrl
        })
      }

      // 小程序跳转原生页面 不支持跳转低码页面 暂不需要 不开放
      // window.Module.linkToPage({
      //   pagecode: '/packageTEST/pages/test/spu'
      // })
      // this.Module.linkToPage = (params: IAny) => {
      //   console.log('linkToPage', params)
      //   if (!window.wx?.miniProgram?.navigateTo) {
      //     console.error('不存在 window.wx.miniProgram.navigateTo，无法跳转')
      //     return
      //   }
      //   window.wx.miniProgram.navigateTo({
      //     url: params.pagecode
      //   })
      // }

      // 呼叫小程序 暂时不用
      // this.Module.callPageEvent = (params: IAny) => {}

      // 跳转H5低码页面
      // window.Module.linkToH5Page({
      //   pagecode: '',
      //   title: '',
      //   __linkparam: {
      //     __pagestatus: '1'
      //   }
      // })
      this.Module.linkToH5Page = async (params: IAny) => {
        console.log('linkToH5Page', params)

        if (!window.wx?.miniProgram?.navigateTo) {
          console.error('不存在 window.wx.miniProgram.navigateTo，无法跳转')
          return
        }
        if (params.mode || params.replace || params.pagesize) {
          console.error('h5 端不支持 mode/replace/pagesize 属性，请移除相关定义。')
          return false
        }

        const envBusiness = await spuManager.getEnvBusiness()
        const origin = envBusiness || location.origin
        // const origin = 'http://120.46.182.226:7000'
        const token = getToken()
        const refreshtoken = getRefreshToken()
        const tokenexpires = getTokenExpires()
        const envname = await getEnvname()
        const isshowhead = '0'
        const ispermission = '1'
        const isfromdsr = '1'
        // todo
        const isdebugger = '1'
        let redirect = `/page/${params.pagecode}?`
        if (params.title) {
          redirect += `pagetitle=${params.title}&`
        }
        const __linkparam = params.__linkparam
        let __linkparamstr = ''
        if (
          Object.prototype.toString.call(__linkparam) === '[object Object]' &&
          Object.getOwnPropertyNames(__linkparam).length
        ) {
          const keys = Object.getOwnPropertyNames(__linkparam)
          keys.forEach((item, i) => {
            __linkparamstr += `${item}=${__linkparam[item]}${keys.length - 1 === i ? '' : '&'}`
          })
          redirect += __linkparamstr
        }
        // redirect = ''

        const h5Url = `${origin}/h5/#/?token=${token}&refreshtoken=${refreshtoken}&tokenexpires=${tokenexpires}&envname=${envname}&ispermission=${ispermission}&isshowhead=${isshowhead}&isdebugger=${isdebugger}&isfromdsr=${isfromdsr}&redirect=${encodeURIComponent(redirect)}`

        // console.log(h5Url)

        window.wx.miniProgram.navigateTo({
          url: `/packageCOM/pages/webview/webview?url=${encodeURIComponent(h5Url)}`
          // url: `/packageCOM/pages/webview/webview?url=${encodeURIComponent(`${origin}/h5/#/`)}`
        })
      }

      // window.Module.operation('complete', {
      //   type: 'success',
      //   // data 对象里面只能有一个属性 也就是业务id
      //   data: {
      //     // lkcd6wknid 为 `${tablename}id`
      //     lkcd6wknid: '1696822644864847872'
      //   }
      // })
      this.Module.operation = (type: string, params: any) => {
        let litheformvisitdata: any = getQueryByUrl('litheformvisitdata')
        if (type === 'complete' && params.type === 'success' && litheformvisitdata) {
          litheformvisitdata = JSON.parse(decodeURIComponent(litheformvisitdata))
          // console.log(params.data)
          // debugger
          const keys = Object.keys(get(params, 'data', {}))
          let visitcontentid = ''
          if (keys.length) {
            visitcontentid = params.data[keys[0]]
          }
          if (!visitcontentid) {
            window.alert('没有业务id，无法提交拜访记录！')
            return false
          }

          let execstatus = '2'
          if (litheformvisitdata.type === 'add') {
            execstatus = '2'
          } else if (litheformvisitdata.type === 'readd') {
            execstatus = '6'
          } else if (litheformvisitdata.type === 'edit') {
            execstatus = '5'
          }
          const submitCustomerstatusid = litheformvisitdata.visitcustomerstatusid || getUniqueid()
          spuAxios
            .post(
              '/visitworkexecute/saveVisitWorkRecord',
              {
                submitter: getUser('mbcode'),
                submittertime: Date.now().toString(),
                customerid: litheformvisitdata.customerid,
                customertype: litheformvisitdata.customertype,
                customerstatusid: submitCustomerstatusid,
                instanceid: submitCustomerstatusid,
                workrecordid: litheformvisitdata.recordid || getUniqueid(),
                actualvisitid: getUniqueid(),
                workid: litheformvisitdata.workid,
                visitcontent: litheformvisitdata.stepname,
                stepid: litheformvisitdata.stepid,
                casecode: litheformvisitdata.casecode,
                visitcontentid,
                settings: JSON.parse(litheformvisitdata.settings),
                execstatus
              },
              {
                modulekey: 'customervisit'
              }
            )
            .then((res: any) => {
              // console.log('then', res, window.Native)
              if (res.code === 200) {
                window.Module?.callModuleEvent &&
                  window.Module.callModuleEvent({
                    modulekey: 'customervisit',
                    key: 'step_execute_success',
                    data: ''
                  })
                window.Native?.exitPage && window.Native.exitPage()
              } else {
                window.alert(res.msg || '网络异常，请稍后重试。')
              }
            })
            .catch((err: any) => {
              // console.error('catch', err)
              window.alert(err.msg || '网络异常，请稍后重试。')
            })
        }
      }

      // 呼叫spu事件
      // window.Module.callModuleEvent({
      //   modulekey: 'customervisit',
      //   key: 'step_execute_success',
      //   data: {
      //     test: '1'
      //   }
      // })
      this.Module.callModuleEvent = (params: { modulekey: string; key: string; data: any }) => {
        const key = `${params.modulekey}-module-event-${params.key}`
        console.log(`callModuleEvent ${key}`)
        window.localStorage.setItem(
          key,
          JSON.stringify({
            data: params.data
          })
        )
        setTimeout(() => {
          window.localStorage.removeItem(key)
        }, 5000)
      }

      // 监听spu事件
      // window.Module.onModuleEvent({
      //   modulekey: 'customervisit',
      //   key: 'step_execute_success'
      //   callback(data) {}
      // })
      this.Module.onModuleEvent = (params: {
        modulekey: string
        key: string
        callback?: Function
      }) => {
        const key = `${params.modulekey}-module-event-${params.key}`
        that._events.set(
          key,
          setInterval(() => {
            console.log(`onModuleEvent ${key}`)
            const lsData = window.localStorage.getItem(key)
            if (lsData) {
              params.callback && params.callback(JSON.parse(lsData).data)
              window.localStorage.removeItem(key)
            }
          }, 300)
        )
      }

      // 删除监听spu事件
      // window.Module.offModuleEvent({
      //   modulekey: 'customervisit',
      //   key: 'step_execute_success'
      // })
      this.Module.offModuleEvent = (params: { modulekey: string; key: string }) => {
        const key = `${params.modulekey}-module-event-${params.key}`
        console.log(`offModuleEvent ${key}`)
        const interval = that._events.get(key)
        clearInterval(interval)
        window.localStorage.removeItem(key)
      }

      this.Native.getLocation = (callback: any) => {
        getLocationByMiniprogram().then((res) => {
          if (res) {
            callback && callback(res)
          } else {
            callback && callback(res, 'getLocation fail')
          }
        })
      }

      this.Native.exitPage = () => {
        if (!window.wx?.miniProgram?.navigateBack) {
          console.error('不存在 window.wx.miniProgram.navigateBack，无法跳转')
          return
        }
        window.wx.miniProgram.navigateBack()
      }

      this.Native.getSystemInfoSync = () => {
        return {
          // version: `v${packageJson.version}`
          version: 'dsr-miniprogram'
        }
      }
    } else if (this.client === 'web') {
    } else if (this.client === 'h5') {
    }
  }

  // 不强制覆盖注入
  inject() {
    const { Module, Native, aPaaS } = this
    for (const x in Module) {
      if (get(window, `Module.${x}`) === undefined) {
        set(window, `Module.${x}`, Module[x])
      }
    }
    for (const x in Native) {
      if (get(window, `Native.${x}`) === undefined) {
        set(window, `Native.${x}`, Native[x])
      }
    }
    for (const x in aPaaS) {
      if (get(window, `aPaaS.${x}`) === undefined) {
        set(window, `aPaaS.${x}`, aPaaS[x])
      }
    }
  }
}

const injectCustomervisitSkip = () => {
  let litheformvisitdata: any = getQueryByUrl('litheformvisitdata')
  litheformvisitdata = litheformvisitdata
    ? JSON.parse(decodeURIComponent(litheformvisitdata))
    : null
  if (litheformvisitdata && litheformvisitdata.showskip === '1') {
    const ele = document.createElement('spu-customervisit-skip')
    document.body.appendChild(ele)
  }
}

const installNativeApi = () => {
  // 暂时只在小程序注入
  // 其他端还是在所在客户端注入
  // dsr小程序打开spu页面 由于没有上一级客户端了 才会 window.parent === window
  // epm小程序由于是套壳h5引擎 打开spu页面 才会 window.parent !== window
  if (window.parent === window) {
    miniProgramInitCallback(() => {
      const miniprogramNativeApi = new NativeApi('miniprogram')
      miniprogramNativeApi.inject()
      injectCustomervisitSkip()
    })
  }
}

export { installNativeApi }
