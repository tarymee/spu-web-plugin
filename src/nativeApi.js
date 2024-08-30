import { globalOptions, axios, getUser, Module } from './index'
import { get, cloneDeep } from 'lodash-es'
import urlquery from './urlquery'
import login from './login'

import G3Manager from './manager'
import { Toast } from 'vant'
import { useLocation } from '@engine/hooks/useLocation'
import { useUniqueid } from '@engine/hooks/useUniqueid'
// import { useCustomervisit } from '@engine/service/G3Customervisit/hooks'
import router from '../../router'

const packageJson = require('../../../../package.json')

class NativeApi {
  // 已经注入api的或者不同域的就不再注入
  checkIsCanInject (iframe) {
    try {
      return !iframe?.contentWindow?.Module
    } catch (err) {
      console.error(err)
      console.error(`SPU 容器无法注入 Native-API，url： ${iframe.src}。`)
      return false
    }
  }

  injectApi (iframe, options) {
    const modulekey = options.modulekey
    // const modulekey = 'demospu'

    const Module = {
      spuContainerType: '',
      getContextSync () {
        return core.getContextSync(modulekey)
      },
      linkToPage: window?.Module?.linkToPage,
      linkToModule: window?.Module?.linkToModule,
      apiRequest: window?.Module?.apiRequest,
      checkPermission: core.checkPermission.bind(core),
      getIndextagSync (params) {
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
    }

    if (options?.litheformvisitdata) {
      // Module.operation('complete', {
      //   type: 'success',
      //   // data 对象里面只能有一个属性 也就是业务id
      //   data: {
      //     // lkcd6wknid 为 `${tablename}id`
      //     lkcd6wknid: '1696822644864847872'
      //   }
      // })
      Module.operation = (type, params) => {
        if (type === 'complete' && params.type === 'success') {
          // console.log(params.data)
          // debugger
          const keys = Object.keys(get(params, 'data', {}))
          let visitcontentid = ''
          if (keys.length) {
            visitcontentid = params.data[keys[0]]
          }
          if (!visitcontentid) {
            Toast.fail('没有业务id，无法提交拜访记录！')
            return false
          }

          let execstatus = '2'
          if (options.litheformvisitdata.type === 'add') {
            execstatus = '2'
          } else if (options.litheformvisitdata.type === 'readd') {
            execstatus = '6'
          } else if (options.litheformvisitdata.type === 'edit') {
            execstatus = '5'
          }

          const { getUniqueid } = useUniqueid()
          // const { visitNext } = useCustomervisit()

          G3Manager.apiRequest({
            modulekey: 'customervisit',
            apitag: 'saveVisitWorkRecord',
            body: {
              submitter: login.getUser('mbcode'),
              customerid: options.litheformvisitdata.customerid,
              submittertime: Date.now().toString(),
              customertype: options.litheformvisitdata.customertype,
              customerstatusid: options.litheformvisitdata.visitcustomerstatusid || getUniqueid(),
              workrecordid: options.litheformvisitdata.recordid || getUniqueid(),
              actualvisitid: getUniqueid(),
              workid: options.litheformvisitdata.workid,
              visitcontent: options.litheformvisitdata.stepname,
              stepid: options.litheformvisitdata.stepid,
              casecode: options.litheformvisitdata.casecode,
              visitcontentid: visitcontentid,
              settings: JSON.parse(options.litheformvisitdata.settings),
              execstatus: execstatus
            },
            complete: (code, data, msg) => {
              if (code === 200) {
                router.back()
                // router.go(-2)
                // visitNext({
                //   customertype: options.litheformvisitdata.customertype,
                //   customerid: options.litheformvisitdata.customerid,
                //   customername: options.litheformvisitdata.customername || '',
                //   saleareaid: options.litheformvisitdata.saleareaid || '',
                //   workid: options.litheformvisitdata.workid,
                //   stepid: options.litheformvisitdata.stepid
                // })
              } else {
                Toast.fail(msg)
                // throw Error(msg)
              }
            }
          })
        }
      }
    }

    const Native = {
      // getLocation (callback) {
      //   const { getLocation } = useLocation()
      //   getLocation().then((res) => {
      //     if (res) {
      //       callback && callback(res)
      //     } else {
      //       callback && callback(res, 'getLocation fail')
      //     }
      //   })
      // },
      getLocation: window?.Native?.getLocation,
      // exitPage () {
      //   router.go(-1)
      // },
      getSystemInfoSync () {
        return {
          version: `v${packageJson.version}`
        }
      }
    }

    const aPaaS = {
      getUserInfoSync: login.getUser,
      getToken (callback) {
        const selfToken = {
          token: login.getToken(),
          tokenExpires: login.getTokenExpires(),
          refreshToken: login.getRefreshToken()
        }
        callback && callback(selfToken)
      },
      async getWebInitParams () {
        const user = login.getUser()
        const context = G3Manager.getContext(modulekey)
        // const moduleData = G3Manager.getModuleData(modulekey).data
        return {
          project: context.modulename,
          appid: context.modulekey,
          clientver: context.moduleversion,
          // anonymousid: '',
          // distinctid: '',
          accountcode: user.accountcode,
          envname: context.envname,
          tenantcode: user.tenantcode,
          tenantname: user.tenantname,
          positionname: user.positionname,
          mbcode: user.mbcode,
          username: `${user.username1 || ''}|${user.username2 || ''}|${user.username3 || ''}`,
          userinfoname: user.userinfoname
        }
      }
    }

    iframe.contentWindow.Module = Module
    iframe.contentWindow.Native = Native
    iframe.contentWindow.aPaaS = aPaaS
  }

  inject (iframe, options) {
    if (this.checkIsCanInject(iframe) && options?.modulekey) {
      this.injectApi(iframe, options)
    }
  }
}

const nativeApi = new NativeApi()

export default nativeApi
