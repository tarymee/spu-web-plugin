const getAttributes = (ele: HTMLElement | null) => {
  // console.log(ele)
  const attrs: any = {}

  if (!ele) return attrs

  const attrSource = Object.values(ele.attributes)
  if (attrSource?.length > 0) {
    attrSource.forEach(ele => {
      const { name, value } = ele as any
      attrs[name] = value
    })
  }
  return attrs
}

export {
  getAttributes
}
