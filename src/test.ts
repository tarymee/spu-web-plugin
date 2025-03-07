// import { loadding } from './components/loadding'
// import { lsProxy } from './storageProxy'
// import core, { Module } from './core'
import { globalOptions, axios, getUser, getToken, getRefreshToken, getTokenExpires, Module } from './index'
import { get, cloneDeep } from 'lodash-es'

async function initTest(options: any) {
  // console.log('initTest')
  // loadding.open()
  // const envname = await login.getEnvname()
  // console.log(envname)
  // const coreData = await core.getData()
  // console.log(coreData)
  // const apiOrigin = await core.getApiOrigin('expandexp')
  // console.log(apiOrigin)
}

export { initTest }
