import { LitElement, css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import { cloneDeep, debounce } from 'lodash-es'
import { listToTree } from './utils'
import { axios } from '../../axios'
import jssdk from '../../jssdk'
import { getExpressionArr } from '../WxworksuiteOpendata/index'

export default class WxworksuiteTree extends LitElement {

  static componentName: string = 'wxworksuite-tree'
  static register () {
    if (!window.customElements.get(WxworksuiteTree.componentName)) {
      window.customElements.define(WxworksuiteTree.componentName, WxworksuiteTree)
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .tree {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    .tree-search {
      margin: 8px 0;
      border: 1px solid #F6F6F6;
      background-color: #FFF;
      /* overflow: hidden; */
      border-radius: 16px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0 12px 0 28px;
      color: #999999;
      background-size: 16px 16px;
      background-position: 8px center;
      background-repeat: no-repeat;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAXpQTFRFAAAAAAAA////qqqqv7+/mZmZqqqqn5+fjo6OmZmZlZWVnZ2dkpKSpKSkmZmZlJSUmZmZm5ubnZ2dl5eXm5ubnJycm5ubmJiYmpqalpaWnZ2dmZmZm5ubmZmZmZmZlpaWmpqam5ubmpqamZmZmJiYl5eXmZmZnJycmpqal5eXmJiYmpqam5ubl5eXmpqamJiYmpqamZmZmpqamZmZmpqamZmZmJiYmZmZnJycmZmZmZmZmpqamZmZmpqamZmZmpqamJiYmpqamZmZmZmZmZmZmZmZmpqamZmZmpqampqamZmZmJiYmZmZmZmZmpqampqamZmZmJiYmZmZmJiYmZmZmZmZmJiYmZmZmpqamZmZmJiYmZmZmZmZmpqamZmZmZmZmpqamZmZmpqamZmZmZmZmZmZmZmZmJiYmZmZmpqamZmZmZmZmpqamZmZmZmZmZmZmZmZmZmZmZmZmZmZmJiYmZmZmZmZmZmZmJiYmZmZmZmZmZmZmpqamZmZU/9+bQAAAH10Uk5TAAEBAwQFBggJCgwNDg4PExQXGhscHyElJicnKCktMjM1ODo8PkBBQ0RHSElKTExNTlBRVVtfYWRkZmlqbG1ub4aLjI+WmJ+goaasrrGys7W3uLm6u7y9wcTFx8vMzM7P0dXW2dve3+Lj4+Tl5ezv8PHy8/X29/n6+/z9/v4sOdMfAAABK0lEQVQYGc3BVztCAQAG4E9DhJSVkZkR2SHK3nuPZJ1Qtsg4re+/6/FIZ9CVC++LP6UtbWgs1+M3jsUHpkSWXRr8wLZHxoTN9ZM38tQOlZ4nhtzFSDG6zih6oNAZS07n4otmIsoxyFSG6YFEhxhthdQGZyDj5bkWGXbe5kHOzyFkzHIcCk7uIuMmUQYFfVgsQloBQ1DZYR3SqngIlQV2Ia2aPqjMsxtphQxCZZv1+HaXKIGC7lE04dscR6HQzn1kNPPKADkfhyGxxSnIjDCoh4TtOemGhOM93gaZ3nhiUo8vOV6R9xbI9Ud4OWhCSl7fEWPXDFggV3tAiserK/4X8qLFLDBggYJzKcyU17UBLWAWGLBASVfR1Gw14JNZYMCIbMxCvAZZ5VvxX3wAF7lDHio0PxcAAAAASUVORK5CYII=);
      /* box-shadow: 0px 0px 2px #ddd inset; */
    }
    .tree-web .tree-search {
      border-radius: 3px;
      border: 1px solid #dcdfe6;
      /* border: none; */
    }
    .tree-search input {
      display: block;
      background-color: #FFF;
      line-height: 30px;
      height: 30px;
      border: none;
      outline: none;
      width: 100%;
      padding: 0;
      margin: 0;
    }
    .tree-web .tree-search input {
      font-size: 12px;
    }
    /* .tree-search input:focus {
      outline: none;
    } */
    .tree-con {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .tree-mobile .tree-con {
      border-radius: 8px;
    }
    .tree-none {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
      font-size: 14px;
    }










    /* :host {
      display: block;
      width: 100%;
      height: 100%;
    } */
    .tree1 {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      position: relative;
      /* overflow: hidden; */
    }
    .tree1-search {
      flex: none;
      margin: 8px 0;
      border: 1px solid #F6F6F6;
      background-color: #FFF;
      border-radius: 16px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 0 12px 0 28px;
      color: #999999;
    }
    .tree1-con {
      flex: 1;
      /* height: calc(100% - 48px); */
      overflow-y: scroll;
      z-index: 1;
      -webkit-overflow-scrolling: touch;
    }
    .tree1-con-text {
      height: 800px;
      background-color: red;
    }
  `

  @property({ type: Array })
  list?: any = []

  // 判断是否开启企微通信录支持，默认不开启
  @property({ type: Boolean })
  iswwopendata: boolean = false

  // 控制通信录转移类型
  @property({ type: String })
  wwopendatatype: string = '' // userName | departmentName | expression | ''

  @property({ type: String })
  valuekey: string = 'id' // 默认id 也可定义别的属性值比如 codepath（被定义的属性值必须唯一）

  @property({ type: Boolean })
  ismulselect: boolean = false

  @property({ type: String })
  displaytype: string = 'mobile' // web | mobile

  @property({ type: Boolean })
  issearch: boolean = true

  @property({ type: String })
  searchplaceholder: string = '请输入关键字搜索'

  // normal 父子有关联 共同取值 半选不取
  // individual 父子无关联 各自独立取值
  // disable 父子有关联 不能选非末级节点 取值末级节点
  // shortcut 父子有关联 取值末级节点
  // related 父子有关联 取值非末级节点 如果只有一级 最高节点同样也是末级节点时 则该级视为最高级 要取值 半选不取
  // highest 父子有关联 取值最高节点
  @property({ type: String })
  mulselectmode: string = 'normal'

  // normal 正常选中取值
  // disable 不能选非末级节点 只能选末级节点 暂不实现
  @property({ type: String })
  singleselectmode: string = 'normal'

  @property({ type: String })
  expandmode: string = 'root' // root | no | all

  @property({ type: String })
  expandicon: string = 'normal' // normal | organization

  @state()
  protected _updatepoint = false

  @state()
  protected _list: any = []

  @state()
  protected _searchlist: any = []

  @state()
  protected _searchvalue: string = ''

  @state()
  protected _data: any = {}

  @state()
  protected _isonelevel = true

  @state()
  protected _isCanUseWxworkSuite = false

  async connectedCallback () {
    super.connectedCallback()
    // console.log('connectedCallback')

    jssdk.init().then(() => {
      this._isCanUseWxworkSuite = true
    }).catch((err) => {
      // console.error('jssdk.init() fail', err)
      this._isCanUseWxworkSuite = false
    })
  }

  willUpdate (changedProperties: any) {
    if (changedProperties.has('list')) {
      this._list = cloneDeep(this.list).map((item: any) => {
        let isexpand = !!item.isexpand
        if (this.expandmode === 'all') {
          isexpand = true
        } else if (this.expandmode === 'root') {
          if (!item.pid) {
            isexpand = true
          } else {
            isexpand = false
          }
        } else if (this.expandmode === 'no') {
          isexpand = false
        }
        return {
          ...item,
          isselected: !!item.isselected,
          isexpand: isexpand,
          checkstate: '0'
        }
      })
      this._data = listToTree(this._list, 'id', 'pid', 'name')

      this._isonelevel = this._data.every((item: any) => !item?.children?.length)
    }
  }

  _updateTemplate () {
    this._updatepoint = !this._updatepoint
    // this.requestUpdate() // 强制更新
  }

  _findNode (id: any) {
    return this._list.find((item: any) => item.id === id)
  }

  _handleToggle (e: any) {
    // console.log(e)
    e.stopPropagation()
    const type = e.detail.type
    const node = e.detail.node
    if (type === 'expand') {
      node.isexpand = !node.isexpand
      this._updateTemplate()
    } else if (type === 'select') {
      this._setSelect(node.id, !node.isselected)
      this._updateTemplate()
    } else if (type === 'check') {
      const checkstate = node.checkstate
      this._setCheck(node.id, checkstate === '1' ? '0' : '1')
      this._updateTemplate()
    }
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: {
        node: node
      }
    }))
  }

  _test () {
    // console.log(this.ismulselect)
    // // this.ismulselect = !this.ismulselect
    // this._data[0].isselected = !this._data[0].isselected
    // this._data[0].name = this._data[0].name + 'x'
    console.log(this._list)
    console.log(this._data)
  }

  _setCheck (id: any, value: '0' | '1' | '2') {
    const setChildren = (node: any, value: any) => {
      node.checkstate = value
      node.children.forEach((item: any) => {
        setChildren(item, value)
      })
    }

    const setParent = (node: any) => {
      if (node.parent) {
        const a = node.parent.children.every((item: any) => item.checkstate === '1')
        const b = node.parent.children.every((item: any) => item.checkstate === '0')
        const c = node.parent.children.some((item: any) => (item.checkstate === '0' || item.checkstate === '2'))
        if (a) {
          node.parent.checkstate = '1'
        } else if (b) {
          node.parent.checkstate = '0'
        } else if (c) {
          node.parent.checkstate = '2'
        }
        setParent(node.parent)
      }
    }

    const node = this._findNode(id)
    if (node) {
      if (this.mulselectmode === 'normal' || this.mulselectmode === 'shortcut' || this.mulselectmode === 'related' || this.mulselectmode === 'highest') {
        setChildren(node, value)
        setParent(node)
      } else if (this.mulselectmode === 'individual') {
        node.checkstate = value
      } else if (this.mulselectmode === 'disable') {
        if (node?.children?.length) {
          console.warn(`id = ${id} 为非末级节点，mulselectmode = ${this.mulselectmode} 模式不能设置非末级节点。`)
          return false
        }
        setChildren(node, value)
        setParent(node)
      } else {
        console.error(`暂不支持 mulselectmode = ${this.mulselectmode} 模式。`)
      }
    } else {
      console.error(`找不到 id = ${id} 的节点。`)
    }
  }

  _setSelect (id: string, value: boolean) {
    this._list.forEach((item: any) => {
      if (item.id === id) {
        item.isselected = value
      } else {
        item.isselected = false
      }
    })
  }

  get _inputRef (): any {
    return this.renderRoot?.querySelector('input') ?? null
  }

  _searchWxContactApi (query_word: string) {
    const wxworksuitedata = jssdk.getData()

    let query_type = 0
    if (this.wwopendatatype === 'userName') {
      query_type = 1
    } else if (this.wwopendatatype === 'departmentName') {
      query_type = 2
    } else if (this.wwopendatatype === 'expression') {
      query_type = 0
    }

    return axios.post('/api/wxwork/contact/search', {
      suiteKey: wxworksuitedata.suiteKey,
      limit: 200, // 查询返回的最大数量，默认为50，最多为200，查询返回的数量可能小于limit指定的值。limit会分别控制在职数据和离职数据的数量。
      query_word: query_word, // 搜索关键词。当查询用户时应为用户名称、名称拼音或者英文名；当查询部门时应为部门名称或者部门名称拼音
      query_type // 查询类型 1：查询用户，返回用户userid列表 2：查询部门，返回部门id列表。 不填该字段或者填0代表同时查询部门跟用户
      // cursor: params.cursor, // 用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填
      // full_match_field: 1, // 精确匹配的字段。1：匹配用户名称或者部门名称 2：匹配用户英文名。不填则为模糊匹配
    }, {
      isShowLoading: false
    }).then((res: any) => {
      if (res?.data?.code === 200 && res?.data?.data?.queryResult) {
        const queryResult = res?.data?.data?.queryResult
        const searchOptions: any = []

        if (queryResult?.party?.departmentId?.length) {
          queryResult.party.departmentId.forEach((id: string) => {
            searchOptions.push({
              id,
              wwopendatatype: 'departmentName'
            })
          })
        }

        if (queryResult?.user?.userid?.length) {
          queryResult.user.userid.forEach((id: string) => {
            searchOptions.push({
              id,
              wwopendatatype: 'userName'
            })
          })
        }

        return searchOptions
      } else {
        throw Error('微信通信录搜索失败')
      }
    })
  }

  _hanldeSearch = debounce(async (e) => {
    // console.log('_hanldeSearch')
    // console.log(e)
    // console.log(this)
    // console.log(this._inputRef)
    this._searchvalue = this?._inputRef?.value || ''
    console.log(this._searchvalue)
    if (this._searchvalue) {
      if (this.iswwopendata && this.wwopendatatype && this._isCanUseWxworkSuite) {
        try {
          const searchOptions = await this._searchWxContactApi(this._searchvalue)

          if (!searchOptions.length && this.wwopendatatype !== 'expression') {
            this._searchlist = []
          } else {
            this._searchlist = this._list.filter((item: any) => {
              if (this.wwopendatatype !== 'expression') {
                if (this.wwopendatatype === 'userName') {
                  const isRealOpenid = item.name.length >= 32 && !/[\u4e00-\u9fa5]/g.test(item.name)
                  if (isRealOpenid) {
                    return searchOptions.some((item2: any) => item2.id.toString() === item.name.toString())
                  } else {
                    return item.name.indexOf(this._searchvalue) !== -1
                  }
                } else if (this.wwopendatatype === 'departmentName') {
                  const isRealOpenid = Number.isInteger(Number(item.name))
                  if (isRealOpenid) {
                    return searchOptions.some((item2: any) => item2.id.toString() === item.name.toString())
                  } else {
                    return item.name.indexOf(this._searchvalue) !== -1
                  }
                }
              } else {
                // return searchOptions.some((item2: any) => item.name.toString().indexOf(item2.id.toString()) !== -1)
                const arr = getExpressionArr(item.name)
                // console.log(arr)
                // console.log(searchOptions)

                const testflag = arr.some((item2: any) => item2.type === 'text' && item2.content.indexOf(this._searchvalue) !== -1)

                const userflag = arr.some((item2: any) => {
                  const isuser = item2.type === 'userName'
                  if (isuser) {
                    // woOUQJEAAABj_VNCcRSWLWqlL2mGAezg
                    // 32个字符+无中文 可以认为是没转移过的openid
                    const isRealUser = item2.content.length >= 32 && !/[\u4e00-\u9fa5]/g.test(item2.content)
                    if (isRealUser) {
                      const a = searchOptions.some((item3: any) => {
                        return item3.wwopendatatype === 'userName' && item3.id.toString() === item2.content.toString()
                      })
                      return a
                    } else {
                      return item2.content.indexOf(this._searchvalue) !== -1
                    }
                  } else {
                    return false
                  }
                })

                const depflag = arr.some((item2: any) => {
                  const isdep = item2.type === 'departmentName'
                  if (isdep) {
                    // 10
                    // 整数 可以认为是没转移过的openid
                    const isRealDep = Number.isInteger(Number(item2.content))
                    if (isRealDep) {
                      const a = searchOptions.some((item3: any) => {
                        return item3.wwopendatatype === 'departmentName' && item3.id.toString() === item2.content.toString()
                      })
                      return a
                    } else {
                      return item2.content.indexOf(this._searchvalue) !== -1
                    }
                  } else {
                    return false
                  }
                })

                return testflag || userflag || depflag
              }
            })
            // console.log(this._searchlist)
          }
        } catch (err) {
          console.error(err)
          this._searchlist = []
        }
      } else {
        this._searchlist = this._list.filter((item: any) => item.name.indexOf(this._searchvalue) !== -1)
      }
    } else {
      this._searchlist = []
    }
  }, 300)

  getValue (type?: string) {
    if (this.ismulselect) {
      let arr = this._list.filter((item: any) => item.checkstate === '1')
      // normal 父子有关联 共同取值 半选不取
      // individual 父子无关联 各自独立取值
      // disable 父子有关联 不能选非末级节点 取值末级节点
      // shortcut 父子有关联 取值末级节点
      // related 父子有关联 取值非末级节点 如果只有一级 最高节点同样也是末级节点时 则该级视为最高级 要取值 半选不取
      // highest 父子有关联 取值最高节点
      if (this.mulselectmode === 'disable' || this.mulselectmode === 'shortcut') {
        arr = arr.filter((item: any) => !item?.children?.length)
      } else if (this.mulselectmode === 'related') {
        arr = arr.filter((item: any) => (item?.children?.length || (!item?.parent && !item?.children?.length)))
      } else if (this.mulselectmode === 'highest') {
        arr = arr.filter((item: any) => !item?.parent)
      }

      if (!type) {
        return arr?.length ? arr.map((item: any) => item[this.valuekey]) : []
      } else if (type === 'name') {
        return arr?.length ? arr.map((item: any) => item.name) : []
      } else if (type === 'fullvalue') {
        return arr?.length ? cloneDeep(arr) : []
      } else {
        return arr?.length ? arr.map((item: any) => item[type]) : []
      }
    } else {
      const obj = this._list.find((item: any) => item.isselected)
      if (!type) {
        return obj ? obj[this.valuekey] : ''
      } else if (type === 'name') {
        return obj ? obj.name : ''
      } else if (type === 'fullvalue') {
        return obj ? cloneDeep(obj) : null
      } else {
        return obj ? obj[type] : ''
      }
    }
  }

  _transValuekeyValueToIdValue (value?: string | string[]) {
    if (this.valuekey === 'id') {
      return value
    } else {
      if (Array.isArray(value)) {
        return value.map((item) => {
          const a = this._list.find((item2: any) => item2[this.valuekey] === item)
          return a?.id || ''
        })
      } else {
        if (value) {
          const a = this._list.find((item2: any) => item2[this.valuekey] === value)
          return a?.id || ''
        } else {
          return value
        }
      }
    }
  }

  setValue (value?: string | string[]) {
    const idValue = this._transValuekeyValueToIdValue(value)
    // debugger
    if (this.ismulselect) {
      this._list.forEach((item: any) => {
        item.checkstate = '0'
      })
      Array.isArray(idValue) && idValue.forEach((item: any) => {
        this._setCheck(item, '1')
      })
      this._updateTemplate()
    } else {
      this._setSelect(idValue as string, true)
      this._updateTemplate()
    }
  }

  setCheck (value: string, flag = true) {
    const idValue = this._transValuekeyValueToIdValue(value)
    this._setCheck(idValue, flag ? '1' : '0')
    this._updateTemplate()
  }

  setSelect (value: string, flag = true) {
    const idValue = this._transValuekeyValueToIdValue(value)
    this._setSelect(idValue, flag)
    this._updateTemplate()
  }

  // rende2r () {
  //   return html`
  //     <div class="tree1">
  //     <div class="tree1-search">搜索</div>
  //     <div class="tree1-con">
  //       <div class="tree1-con-text">暂无搜索结果</div>
  //     </div>
  //   </div>
  //   `
  // }

  render () {
    return html`
      <div class=${classMap({
        'tree': true,
        'tree-web': this.displaytype === 'web',
        'tree-mobile': this.displaytype === 'mobile'
      })}>
        <!-- <button class="demo" @click="${this._test}">
          _test
          ${this.ismulselect}
        </button> -->

        ${
          (this?._data?.length && this.issearch)
          ?
          html`
            <div class="tree-search">
              <!-- @ts-ignore -->
              <input placeholder=${this.searchplaceholder} value=${this._searchvalue} @input=${this._hanldeSearch} />
            </div>
          `
          :
          ''
        }

        ${
          this?._data?.length
          ?
          html`
            <div class="tree-con" style=${styleMap({
              height: this.issearch ? 'calc(100% - 48px)' : '100%',
            })}>
              ${
                this._searchvalue
                ?
                html`
                  ${
                    this?._searchlist?.length
                    ?
                    html`
                      ${
                        repeat(
                          this._searchlist,
                          (item: any) => item.id,
                          (item, index) => html`
                            <wxworksuite-treenode
                              displaytype="${this.displaytype}"
                              expandmode="${this.expandmode}"
                              expandicon="${this.expandicon}"
                              .node="${item}"
                              .isonelevel="${true}"
                              .isrenderchildren="${false}"
                              .iswwopendata="${this.iswwopendata}"
                              wwopendatatype="${this.wwopendatatype}"
                              .ismulselect="${this.ismulselect}"
                              .updatepoint="${this._updatepoint}"
                              @toggle="${this._handleToggle}"
                            >
                          </wxworksuite-treenode>
                          `
                        )
                      }
                    `
                    :
                    html`
                      <div class="tree-none">暂无搜索结果</div>
                    `
                  }
                `
                :
                html`
                  ${
                    repeat(
                      this._data,
                      (item: any) => item.id,
                      (item, index) => html`
                        <wxworksuite-treenode
                          displaytype="${this.displaytype}"
                          expandmode="${this.expandmode}"
                          expandicon="${this.expandicon}"
                          .node="${item}"
                          .isonelevel="${this._isonelevel}"
                          .isrenderchildren="${true}"
                          .iswwopendata="${this.iswwopendata}"
                          wwopendatatype="${this.wwopendatatype}"
                          .ismulselect="${this.ismulselect}"
                          .updatepoint="${this._updatepoint}"
                          @toggle="${this._handleToggle}"
                        >
                      </wxworksuite-treenode>
                      `
                    )
                  }
                `
              }

            </div>
          `
          :
          html`<div class="tree-none">暂无数据</div>`
        }
      </div>
    `
  }
}

// father isselected: ${item.isselected}<br />
// father ismulselect: ${this.ismulselect}<br />
