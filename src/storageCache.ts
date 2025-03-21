import { lsProxy } from './storageProxy'

const cache: IAny = {}

function getData(key: string) {
  if (cache[key]) {
    return cache[key]
  } else {
    const data = lsProxy.getItem(key)
    cache[key] = data
    return data
  }
}

function setData(key: string, value: any) {
  cache[key] = value
  lsProxy.setItem(key, value)
}

function removeData(key: string) {
  delete cache[key]
  lsProxy.removeItem(key)
}

export { getData, setData, removeData }
