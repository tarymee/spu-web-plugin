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
    const tenantsettingStr = lsProxy.getItem('tenantsetting')
    if (tenantsettingStr) {
      const tenantsetting = JSON.parse(tenantsettingStr)


      // tenantsetting.lbssetting = {
      //   enable: '1',
      //   setting: {
      //     type: '',
      //     key: {
      //       web: '',
      //       android: '',
      //       ios: '',
      //       harmony: ''
      //     },
      //     secretkey: {
      //       web: '',
      //       android: '',
      //       ios: '',
      //       harmony: ''
      //     }
      //   }
      // }
      // // tenantsetting.lbssetting.setting.type = 'amap'
      // // tenantsetting.lbssetting.setting.key.web = '1993ac213d2f4675ac1bffb1b03ef1f0'
      // // tenantsetting.lbssetting.setting.secretkey.web = '816fe46b7b7bce145940b93c1e4818fa'

      // // tenantsetting.lbssetting.setting.type = 'tencent'
      // // tenantsetting.lbssetting.setting.key.web = 'NHBBZ-K5LCQ-LF35M-2CTDP-E4OO7-AIBFT'

      // tenantsetting.lbssetting.setting.type = 'baidu'
      // tenantsetting.lbssetting.setting.key.web = '7r3bsPeQqJ74vsxf3EOXg7C1AM4lOWA1'


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
