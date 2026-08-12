import { globalOptions } from './index'

let CenterHost = ''

export const getCenterHost = () => {
  return CenterHost
}

export const setCenterHost = (host: string) => {
  CenterHost = host
}

export const installCenterHost = () => {
  setCenterHost(globalOptions.centerHost)
}
