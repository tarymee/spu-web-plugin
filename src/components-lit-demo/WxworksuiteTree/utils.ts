// import { cloneDeep } from 'lodash-es'

export const listToTree = (data: any[], idkey = 'id', pidkey = 'pid', labelkey = 'name'): any[] => {
  // const cloneData = JSON.parse(JSON.stringify(data))
  // const cloneData = cloneDeep(data)
  const cloneData = data
  const map = new Map()

  cloneData.forEach((d: any) => {
    if (!d[idkey]) throw new Error('请设置正确的id和parentid')
    map.set(d[idkey], true)
    d.id = d[idkey]
    d.name = d[labelkey]
  })

  const rootids: string[] = []
  cloneData.forEach((item: any) => {
    if (!item[pidkey] || !map.has(item[pidkey])) {
      rootids.push(item[idkey])
    }
  })

  const tree = cloneData.filter((father: any) => {
    const childrenArr = cloneData.filter((child: any) => {
      return father[idkey] === child[pidkey]
    })
    childrenArr.forEach((item) => {
      item.parent = father
    })
    father.children = childrenArr.length > 0 ? childrenArr : []
    return rootids.includes(father[idkey])
  })
  return tree
}
