import { globalOptions } from './index'
import core from './core'
import { cloneDeep, merge, set } from 'lodash-es'
import { getUser, checkLogin } from './login'
import { getEnvname } from './envService'

// @ts-ignore
import ApaasSpuTrack from './package/apaas-track/apaas-spu/index.umd.js'
// import ApaasSpuTrack from './package/apaas-track/apaas-spu/index.js'
// import * as ApaasSpuTrack from './package/apaas-track/apaas-spu/index.mjs'
// console.log(ApaasSpuTrack)
// console.log(window.ApaasSpuTrack)

const getWebInitParams = async () => {
  const user = getUser()
  const envname = await getEnvname()
  return {
    project: globalOptions.modulename,
    appid: globalOptions.modulekey,
    clientver: globalOptions.moduleversion,
    // anonymousid: '',
    // distinctid: '',
    accountcode: user.accountcode,
    envname: envname,
    tenantcode: user.tenantcode,
    tenantname: user.tenantname,
    positionname: user.positionname,
    mbcode: user.mbcode,
    username: `${user.username1 || ''}|${user.username2 || ''}|${user.username3 || ''}`,
    userinfoname: user.userinfoname
  }
}

const apaasSpuTrackSendLog = (data: any, isnotretry: boolean = false) => {
  if (window.apaasSpuTrack) {
    const logtime = Date.now().toString()
    const baselog = cloneDeep({
      ...window.apaasSpuTrack.baseLog,
      logtime: logtime,
      epochnanos: logtime + '000000',
      types: '',
      event: '',
      url: location.href,
      properties: {
        // // 图片导出相关信息
        // // formtype: apaas | litheform | spu
        // formtype: 'spu',
        // // exporttype: 1=普通导出 | 2=后端图片扩展导出 | 3=图片导出SPU
        // exporttype: '3',
        // // pagecode
        // // 当 formtype = apaas 表示低码表单code
        // // 当 formtype = litheform 表示超表表单code
        // // 当 formtype = spu 表示配置的spu页面pagecode
        // pagecode: ''
      }
    })
    const mergedata = merge(baselog, data)
    // console.log(mergedata)
    // debugger
    window.apaasSpuTrack.addLogToQueue(mergedata, true)
  } else {
    if (!isnotretry) {
      console.warn('window.apaasSpuTrack 不存在，导出日志延迟3秒后再次发送。')
      setTimeout(() => {
        apaasSpuTrackSendLog(data, true)
      }, 3000)
    } else {
      console.error('window.apaasSpuTrack 不存在，导出日志发送失败。')
    }
  }
}

// 兼容开启SPU日志
const installApaasSpuTrack = () => {
  setTimeout(() => {
    if (ApaasSpuTrack && !window.apaasSpuTrack && checkLogin() && getUser()) {
      if (!window?.aPaaS?.getWebInitParams) {
        set(window, 'aPaaS.getWebInitParams', getWebInitParams)
      }
      if (!window?.Module?.getIndextagSync) {
        set(window, 'Module.getIndextagSync', core.getIndextagSync.bind(core))
      }

      ApaasSpuTrack.getApaasSpuTrack({
        url: 'https://log.xuantongkeji.com/?project=xw_module',
        zip: false,
        online: true,
        http: {
          trackRequesetData: true
        }
      }).then((apaasSpuTrack: ApaasSpuTrack) => {
        console.log('apaasSpuTrack', apaasSpuTrack)
        window.apaasSpuTrack = apaasSpuTrack

        // // 监听关闭事件
        // window.addEventListener('beforeunload', (e) => {
        //   // console.log(e)
        //   // debugger
        //   // window.dispatchEvent(new Event('pagehide'))
        //   let beforeunloadCount = window.localStorage.getItem('beforeunloadCount')
        //   if (!beforeunloadCount) {
        //     beforeunloadCount = 0
        //   }
        //   window.localStorage.setItem('beforeunloadCount', (Number(beforeunloadCount) + 1).toString())
        // })

        // // 监听关闭事件
        // window.addEventListener('pagehide', () => {
        //   // debugger
        //   let pagehideCount = window.localStorage.getItem('pagehideCount')
        //   if (!pagehideCount) {
        //     pagehideCount = 0
        //   }
        //   window.localStorage.setItem('pagehideCount', (Number(pagehideCount) + 1).toString())
        // })

        // 重写 transformLog 底层方法
        let initindextag = ''
        apaasSpuTrack.transformLog = (log: any) => {
          // console.error(22222222222222)
          if (log.properties) {
            // 发送所有类型的日志前统一在 properties 对象属性下增加SPU相关属性值：modulekey、modulename、moduleversion、indextag、initindextag、toindextag、fromindextag。
            log.properties.modulekey = log.appid
            log.properties.modulename = log.project
            log.properties.moduleversion = log.clientver
            // debugger

            const urlParseRes = window.Module.getIndextagSync({
              url: log.url
            })
            log.properties.indextag = urlParseRes.indextag

            // 初始化时记录 initindextag 之后为每个日志都添加 initindextag
            if (log.types === 'init') {
              initindextag = log.properties.indextag
            }
            log.properties.initindextag = initindextag

            if (log.types === 'pageview' && log.properties.to) {
              const toParseRes = window.Module.getIndextagSync({
                url: log.properties.to
              })
              log.properties.toindextag = toParseRes.indextag
            }
            if (log.types === 'pageview' && log.properties.from) {
              const fromParseRes = window.Module.getIndextagSync({
                url: log.properties.from
              })
              log.properties.fromindextag = fromParseRes.indextag
            }
          }
          return log
        }

        apaasSpuTrack.start()
      })
    }
  }, 3000)
}

export { installApaasSpuTrack, apaasSpuTrackSendLog }
