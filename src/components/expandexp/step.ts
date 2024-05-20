export class Step {
  statusMap: Array<string> = [
    'initial',
    'ready',
    'running',
    'ext_readyrun',
    'ext_running',
    'success',
    'error',
    'cancel'
  ]
  statusTextMap: Array<string> = [
    '',
    '已加入导出队列，等待导出',
    '文件下载中',
    '图片处理中',
    '图片处理中',
    '导出完成',
    '导出失败',
    '任务已取消'
  ]
  status = 0
  statusName = 'initial'
  statusText = ''

  next () {
    this.go(this.statusMap[this.status + 1])
  }

  go (statusName: string) {
    const status = this.statusMap.findIndex((item) => {
      return item === statusName
    })
    if (status < 0) {
      console.error(`不存在 ${statusName} 状态`)
    } else {
      this.status = status
      this.statusName = this.statusMap[this.status]
      this.statusText = this.statusTextMap[this.status]
    }
  }

  current () {
    return this.statusName
  }
}
