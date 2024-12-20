interface IMultiUploadOptions {
  bucket: string
  key: string
  partSize?: number
  parallel: number
  onProgress?: (number: number) => void
}
interface IUploadPartRes {
  PartNumber: number
  ETag: string
}

interface ITask<T> {
  (): Promise<T>
}

export const obsMultiUpload = async (obs: any, file: File | Blob, options: IMultiUploadOptions) => {
  const partSize = options.partSize || 1024 * 1024 // 1M
  const parallel = options.parallel || 3
  const initialRes = await obs.initiateMultipartUpload({
    Bucket: options.bucket,
    Key: options.key
  })
  if (initialRes.CommonMsg.Status < 300) {
    const { UploadId } = initialRes.InterfaceResult
    const count = Math.ceil(file.size / partSize)
    // const dones: Array<IUploadPartRes> = []
    const tasks: Array<ITask<IUploadPartRes>> = []
    const transferredArr = new Array(count).fill(0)
    for (let i = 1; i <= count; i++) {
      const uploadPart = async () => {
        const partRes = await obs.uploadPart({
          Bucket: options.bucket,
          Key: options.key,
          // 设置分段号，范围是1~10000
          PartNumber: i,
          // 设置Upload ID
          UploadId: UploadId,
          // 设置将要上传的大文件
          SourceFile: file, // 设置分段大小
          PartSize: partSize,
          // 设置分段的起始偏移大小
          Offset: partSize * (i - 1),
          ProgressCallback: (transferredAmount: number, totalAmount: number) => {
            // TODO 不能直接加，transferredAmount有重复的
            transferredArr[i - 1] = transferredAmount
            const transferred = transferredArr.reduce((item, prev) => {
              return item + prev
            }, 0)
            let percent = transferred / file.size
            if (percent === 1) {
              percent = 0.9999999
            }
            options.onProgress && options.onProgress(percent)
          }
        })
        if (partRes.CommonMsg.Status < 300) {
          // dones.push({
          //     part: i,
          //     etag: partRes.InterfaceResult.ETag
          // })
          return {
            PartNumber: i,
            ETag: partRes.InterfaceResult.ETag
          }
        } else {
          throw partRes.CommonMsg.Message
        }
      }
      tasks.push(uploadPart)
    }
    const partsRes = await executeTasks(tasks, parallel)
    // complete
    const completeRes = await obs.completeMultipartUpload({
      Bucket: options.bucket,
      Key: options.key,
      UploadId: UploadId,
      Parts: partsRes
    })
    if (completeRes.CommonMsg.Status < 300) {
      // 进度条
      options.onProgress && options.onProgress(1)
      return true
    } else {
      throw completeRes.CommonMsg.Message
    }
  } else {
    console.error(initialRes)
    throw initialRes.CommonMsg.Message
  }
}

const executeTasks = async <T> (tasks: Array<ITask<T>>, parallel = 3): Promise<Array<T>> => {
  return new Promise((resolve, reject) => {
    const todos = tasks.slice(0, parallel)
    const pendings = tasks.slice(parallel)
    let success = 0
    const res: Array<T> = []
    const dealPending = (todoRes: any, index?: number): Promise<any> | undefined => {
      success = success + 1
      if (index !== undefined && index !== null) {
        res[index] = todoRes
      }
      if (success === tasks.length) {
        resolve(res)
      }
      if (!pendings.length) return
      const todo = pendings.shift()
      const todoIndex = tasks.findIndex((task) => {
        return task === todo
      })
      return todo && todo()
        .then((todoRes) => dealPending(todoRes, todoIndex))
        .catch(reject)
    }
    if (!pendings.length) {
      const running = todos.map((todo) => {
        return todo()
      })
      return Promise.all(running).then(resolve).catch(reject)
    }
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i]
      todo()
        .then((todoRes) => dealPending(todoRes, i))
        .catch(reject)
    }
  })
}
