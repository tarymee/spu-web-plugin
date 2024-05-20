export const dealCostTime = (val: number) => {
  // const $t = useI18n().t
  // 1000 * 60 * 1 + 1000 *58 + 500  //1分58.5秒
  // val = 1000 * 60 * 60 * 2 +  1000 * 60 * 1 + 1000 *58 + 500 // 两小时1分58.5秒
  if (val < 1000) {
    return '1' + '秒'
  } else if (val >= 1000 && val < 1000 * 60) {
    return `${(val / 1000).toFixed(2)}` + '秒'
  } else if (val >= 1000 * 60 && val < 1000 * 60 * 60) {
    // return `${moment
    //     .duration((val / (1000 * 60)).toFixed(2), 'minute')
    //     .locale('zh_CN')
    //     .humanize()}`
    return Math.floor(val / (1000 * 60)) + '分' + Math.ceil((val % (1000 * 60)) / 1000) + '秒'
  } else {
    // return `${moment
    //     .duration((val / (1000 * 60 * 60)).toFixed(2), 'hour')
    //     .locale('zh_CN')
    //     .humanize()}`
    return (
      Math.floor(val / (1000 * 60 * 60)) +
      '时' +
      Math.floor((val % (1000 * 60 * 60)) / (1000 * 60)) +
      '分' +
      Math.ceil((val % (1000 * 60)) / 1000) +
      '秒'
    )
  }
}

export const fixFileName = (sheetname: string, type: string) => {
  let fileName = sheetname && sheetname.replace('.xlsx', '').replace('.csv', '')
  if (parseInt(type) === 1) {
    fileName = fileName + '.xlsx'
  } else if (parseInt(type) === 2) {
    fileName = fileName + '.csv'
  }
  return fileName
}

export const dealResultMessage = (item: any) => {
  if (!item.errorfileurl && !item.fatalerrormsg) {
    // 成功
    return `成功导出${item.exptotalitem}条数据，耗时${dealCostTime(+item.finishdate - +item.initdate)}`
  } else if (item.fatalerrormsg) {
    return `${item.fatalerrormsg}`
  } else {
    return `总计${item.exptotalitem}条数据，成功${item.expsuctotalitem}条，失败${
      item.exptotalitem - item.expsuctotalitem
    }条，耗时${dealCostTime(+item.finishdate - +item.initdate)}`
  }
}

export const sizeUnit = (val: number) => {
  if (!val) {
    return '0kb'
  }
  if (val < 1024) {
    return `${val}b`
  } else if (val >= 1024 && val < 1024 * 1024) {
    return `${(val / 1024).toFixed(2)}kb`
  } else {
    return `${(val / (1024 * 1024)).toFixed(2)}mb`
  }
}

// 兼容 val 为数字如4000 或者 4kb
export const dealFileSize = (val: number | string): string => {
  if (val === '' || val === null) {
    return ''
  } else if (val === 0 || val === '0') {
    return '0kb'
  } else if (Number(val)) {
    val = Number(val)
    if (val < 1024) {
      return `${val}b`
    } else if (val >= 1024 && val < 1024 * 1024) {
      return `${(val / 1024).toFixed(2)}kb`
    } else {
      return `${(val / (1024 * 1024)).toFixed(2)}mb`
    }
  } else {
    return val.toString()
  }
}
