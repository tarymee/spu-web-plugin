import CryptoJS from 'crypto-js'

// 二进制转字符串
function byteToString(arr: any[]): string {
  let str = ''
  const _arr = arr
  for (let i = 0; i < _arr.length; i++) {
    const one = _arr[i].toString(2)
    const v = one.match(/^1+(?=0)/)
    if (v && one.length === 8) {
      const bytesLength = v[0].length
      let store = _arr[i].toString(2).slice(7 - bytesLength)
      for (let st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2)
      }
      str += String.fromCharCode(Number.parseInt(store, 2))
      i += bytesLength - 1
    } else {
      str += String.fromCharCode(_arr[i])
    }
  }
  return str
}

const key = byteToString([0x36, 0x31, 0x33, 0x30, 0x32, 0x32, 0x32, 0x32, 0x32])

// 加密算法
function encrypt(dataString: string) {
  // ENC加密
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(dataString, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  // base64加密
  const base64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  return base64
}

// 解密算法
function decrypt(base64: string) {
  // base64解密
  const encryptedString = CryptoJS.enc.Base64.parse(base64)
  const ciphertext = encryptedString.toString()
  // ENC解密
  const keyHex = CryptoJS.enc.Utf8.parse(key)

  const decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    } as any,
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  const result = decrypted.toString(CryptoJS.enc.Utf8)
  return result
}

export { encrypt, decrypt }
