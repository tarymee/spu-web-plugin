import { axios } from './axios'
import { decrypt } from './crypt'
import { lsProxy } from './storageProxy'

class TenantSetting {
  async requestAndSetTenantSetting(tenantcode?: string) {
    try {
      const res = await axios.post(
        '/api/auth/tenantsettings',
        {
          tenantcode: tenantcode || ''
        },
        {
          isSendToken: false,
          isSendTecode: true,
          isShowErrorMessage: false
        }
      )

      let tenantSetting = res?.data?.econfig || ''
      if (tenantSetting) {
        tenantSetting = decrypt(tenantSetting)
      }
      // console.log(tenantSetting)
      // debugger
      if (tenantSetting) {
        lsProxy.setItem('tenantsetting', tenantSetting)
      } else {
        this.removeTenantSetting()
      }
    } catch (err) {
      console.error(err)
      this.removeTenantSetting()
    }
  }

  removeTenantSetting() {
    lsProxy.removeItem('tenantsetting')
  }

  get(key: string) {
    // const tenantsetting = {
    //   lbssetting: {
    //     enable: '1',
    //     setting: {
    //       type: '',
    //       key: {
    //         web: '',
    //         android: '',
    //         ios: '',
    //         harmony: ''
    //       },
    //       secretkey: {
    //         web: '',
    //         android: '',
    //         ios: '',
    //         harmony: ''
    //       }
    //     }
    //   }
    // }

    // // 高德地图key配置错误
    // // 1 如果是key格式不对 那么没返回promise 连window.AMap都拿不到 地图和都不能用
    // // 1 如果是key对式对 但key不对 有返回 window.AMap 但api定位调用失败 地图可以渲染空白地图

    // // // 高德地图公司key
    // // tenantsetting.lbssetting.setting.type = 'amap'
    // // tenantsetting.lbssetting.setting.key.web = '1993ac213d2f4675ac1bffb1b03ef1f0'
    // // tenantsetting.lbssetting.setting.secretkey.web = '816fe46b7b7bce145940b93c1e4818fa'

    // // // 高德地图个人key
    // // tenantsetting.lbssetting.setting.type = 'amap'
    // // tenantsetting.lbssetting.setting.key.web = 'e4d25fe4661a34198c4e6f79abe9afac'
    // // tenantsetting.lbssetting.setting.secretkey.web = 'a6b674affd9a3278c68602cf7ba02fcb'

    // // tencent地图key配置错误
    // // 1 如果是地图 会在地图上明确文字提示 鉴权失败，请传入正确的key
    // // 2 如果是调用定位等api 会返回 catch 和详细的错误信息
    // // getIPLocationByTMap fail: {"status":311,"message":"key格式错误","request_id":"ccedb04fd95e4f3f9cd45cfbad729d10","id":"cbm919vjdj0"}
    // // getIPLocationByTMap fail: {"status":190,"message":"无效的key","request_id":"b6ca9d0749eb4c91a47db9412b1253ca","id":"cbm919wxo40"}
    // tenantsetting.lbssetting.setting.type = 'tencent'
    // tenantsetting.lbssetting.setting.key.web = 'NHBBZ-K5LCQ-LF35M-2CTDP-E4OO7-AIBFT'
    // tenantsetting.lbssetting.setting.secretkey.web = 'zowvV5I2pSxqgGb2Sgr1x62HGXbqdxT0'

    // // 百度地图key配置错误alert以下信息
    // // 您提供的密钥不是有效的百度LBS开放平台密钥，或此密钥未对本应用的百度地图JavaScriptAPI授权。您可以访问如下网址了解如何获取有效的密钥：http://lbsyun.baidu.com/apiconsole/key#。
    // // tenantsetting.lbssetting.setting.type = 'baidu'
    // // tenantsetting.lbssetting.setting.key.web = '7r3bsPeQqJ74vsxf3EOXg7C1AM4lOWA1'

    // // tenantsetting.lbssetting.setting.type = 'tencent'
    // // tenantsetting.lbssetting.setting.key.web = ''
    // // tenantsetting.lbssetting.setting.secretkey.web = ''

    // lsProxy.setItem('tenantsetting', JSON.stringify(tenantsetting))

    let tenantsettingStr = lsProxy.getItem('tenantsetting')
    if (tenantsettingStr) {
      const tenantsetting = JSON.parse(tenantsettingStr)
      if (key) {
        return tenantsetting[key]
      }
      return tenantsetting
    } else {
      return null
    }
  }
}

const tenantSetting = new TenantSetting()

export { tenantSetting }
