// import { noBaseRequest } from '@/service/http'
import { axios } from '../index'

export type ServToken = {
  accesskeyid: string
  accesskeysecret: string
  expiration: string
  securitytoken: string
}

export type Response<T> = {
  // eslint-disable-next-line camelcase
  resp_data: T
}

// 一个小时的超时能力 1000 * 60 * 60
let last = 0
let servtoken: ServToken | null = null
let isGetting = false
let xhr: Promise<ServToken> | null = null

const getServToken = async () => {
  try {
    const response: ServToken = await axios.get('/api/teapi/auth/servtoken', {}).then((res: any) => res.data)
    // debugger
    return response
  } catch (e) {
    throw new Error((e as any).errorMsg || 'get servtoken error')
  }
}

export const initServToken = () => {
  return new Promise<ServToken>((resolve, reject) => {
    // 在请求中,排队列
    if (isGetting && xhr) {
      xhr
        .then((res) => {
          if (res) {
            servtoken = res
            last = new Date(res.expiration).getTime()
            isGetting = false
            xhr = null
            resolve(servtoken)
          } else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(null)
          }
          // return res
        })
        .catch(() => {
          xhr = null
          isGetting = false
          // return null
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(null)
        })
    } else {
      if (!last || last - Date.now() < 1000 * 60 * 5) {
        // 过期了 重新请求
        isGetting = true
        xhr = getServToken()
        xhr
          .then((res) => {
            servtoken = res
            last = new Date(res.expiration).getTime()
            isGetting = false
            xhr = null
            // return res
            resolve(servtoken)
          })
          .catch(() => {
            xhr = null
            isGetting = false
            // return null
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(null)
          })
      } else {
        // 没过期
        resolve(servtoken as ServToken)
      }
    }
  })
}









// // let last = 0
// // let servtoken
// let isRequesting = false
// const getServToken = function () {
//   let servtoken = wx.getStorageSync('servtoken')
//   let last
//   if (servtoken) {
//     last = new Date(servtoken.expiration).getTime()
//   }
//   const now = Date.now()
//   if (!servtoken || (last - now < (1000 * 60 * 5))) {
//     wx.removeStorageSync('servtoken')
//     if (!isRequesting) {
//       isRequesting = true
//       return request({
//         url: `${api.HOST}/api/teapi/auth/servtoken`,
//         method: 'get',
//         isShowLoading: false
//       }).then((res) => {
//         wx.setStorageSync('servtoken', res.data.resp_data)
//         isRequesting = false
//         return res.data.resp_data
//       })
//     } else {
//       return new Promise((resolve, reject) => {
//         const fn = setInterval(() => {
//           let servtoken = wx.getStorageSync('servtoken')
//           if (servtoken) {
//             resolve(servtoken)
//             clearInterval(fn)
//           }
//         }, 200)
//       })
//     }
//   } else {
//     return Promise.resolve(servtoken)
//   }
// }
