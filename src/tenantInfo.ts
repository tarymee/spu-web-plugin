import { apaasAxios } from './axios'
import cloudServ from './cloudServ'
import { lsProxy } from './storageProxy'

class TenantInfo {
  async get (tenantCode?: string) {
    try {
      const tenants: null | ITenantInfo[] = await apaasAxios.get('/api/auth/tenantlist', {}).then((res: any) => {
        // debugger
        return res?.data?.tenants
      })

      // debugger

      if (tenants && tenants.length) {
        if (!tenantCode) {
          return tenants[0]
        } else {
          const res =
            tenants.find((item) => {
              return item.code === tenantCode
            }) || null
          return res
        }
      } else {
        return null
      }
    } catch (e) {
      throw new Error((e as any).errorMsg)
    }
  }

  format (tenant: ITenantInfo) {
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

  async getAndSave (tenantCode?: string) {
    const tenant: ITenantInfo | null = await this.get(tenantCode)
    if (!tenant) {
      lsProxy.removeItem('tenant')
      cloudServ.remove()
      return
    }

    lsProxy.setItem('tenant', JSON.stringify(tenant))
    const normalizedTenant = this.format(tenant)
    if (normalizedTenant) {
      cloudServ.set(normalizedTenant)
    }
  }
}

export default new TenantInfo()
