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
