<template>
  <van-config-provider :theme="varthemes" style="height:100%">
    <van-tabs v-model:active="customerType" color="#ffffff" title-active-color="#1A85FF" title-inactive-color="#FFFFFF"
      type="card" background="1A85FF" class="customer-list-page-unique" :style="{height:(customerType === '1' && (auths.storeAdd || auths.distributeorAdd)) || (customerType === '2' && auths.channelAdd) ? 'calc(100% - 64px)' : '100%'}">
      <van-tab title="网点客户" name="1" style="height:100%" class="tabw">
        <div class="filter-wrap">
          <div class="search-wrap">
            <div class="input-wrap">
              <i class="h5iconfont h5icon-search" style="color:#999999;padding-bottom:1px" />
              <input placeholder="客户名称、负责人姓名" v-model="searchText1" @keyup.enter="onSearch1" />
            </div>
          </div>
          <div class="select-wrap" @click="showAction = true">
            <div class="select-content">
              <span class="value">{{ storeType.key ? storeType.name : '客户类型' }}</span>
              <van-icon name="play" style="transform: rotate(90deg);margin-left:4px" />
            </div>
          </div>
        </div>
        <div class="customer-list-content" v-show="loading1 || list1.length > 0">
          <van-pull-refresh v-model="refreshing1" @refresh="onRefresh1">
            <van-list v-model:loading="loading1" :finished="finished1" finished-text="没有更多了" @load="onLoad1">
              <list-item v-for="item in list1" :key="item" :item="item" type="1" @click="toDetail(item, '1')"
                :visit="toVisit" :miss="toMiss" :authVisit="auths.storeVisit" :authMiss="auths.storeMiss" />
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="customer-list-content" v-show="!loading1 && list1.length === 0">
          <smt-none style="height:100%"></smt-none>
        </div>
      </van-tab>
      <van-tab title="经销商客户" name="2" style="height:100%" class="tabj">
        <div class="filter-wrap">
          <div class="search-wrap">
            <div class="input-wrap">
              <i class="h5iconfont h5icon-search" style="color:#999999;padding-bottom:1px" />
              <input placeholder="客户名称、负责人姓名" v-model="searchText2" @keyup.enter="onSearch2" />
            </div>
          </div>
        </div>
        <div class="customer-list-content" v-show="loading2 || list2.length > 0">
          <van-pull-refresh v-model="refreshing2" @refresh="onRefresh2">
            <van-list v-model:loading="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2">
              <list-item v-for="item in list2" :key="item" :item="item" type="2" @click="toDetail(item, '2')"
                :visit="toVisit" :miss="toMiss" :authVisit="auths.channelVisit" :authMiss="auths.channelMiss" />
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="customer-list-content" v-show="!loading2 && list2.length === 0">
          <smt-none style="height:100%"></smt-none>
        </div>
      </van-tab>
    </van-tabs>
    <div class="customer-list-page-unique-bottombtn"
      v-show="(customerType === '1' && (auths.storeAdd || auths.distributeorAdd))">
      <van-button v-show="(customerType === '1' && auths.distributeorAdd)" color="#1A85FF" plain @click="toAdd('fxs')"
        style="margin-right:12px">新增分销商
      </van-button>
      <van-button v-show="(customerType === '1' && auths.storeAdd)"
        color="linear-gradient( 134deg, #1A85FF 0%, #1AA4FF 100%)" @click="toAdd('zd')">新增终端</van-button>
    </div>
    <div class="customer-list-page-unique-bottombtn" v-show="(customerType === '2' && auths.channelAdd)">
      <van-button @click="toAdd('jxs')" color="linear-gradient( 134deg, #1A85FF 0%, #1AA4FF 100%)">新增经销商</van-button>
    </div>
  </van-config-provider>
  <van-action-sheet v-model:show="showAction" :actions="actions" close-on-click-action @select="onSelectType"
    @cancel="resetCustomerType">
    <template #cancel>
      <i class="h5iconfont h5icon-refresh1 icon" style="color:#303133;font-size:14px;margin-right:4px" />重置
    </template>
  </van-action-sheet>
</template>


<script setup>
// import { inject, ref, reactive, onActivated } from 'vue'
const { axios, useRouter, useVisitwork, dayjs, useLocation, functionCheck, Module, setTitle } = inject('service')
const router = useRouter()
const { start, miss, toGetMissPermission } = useVisitwork()
const { getLocation } = useLocation()

setTitle('客户列表')

const varthemes = reactive({
  fieldPlaceholderTextColor: '#999999'
})

const customerType = ref('1')
const storeType = ref({})
window.sessionStorage.setItem('usersource', 'sfa')
const auths = reactive({
  storeAdd: functionCheck('1559778634640789504'),
  distributeorAdd: functionCheck('1815299176712777728'),
  channelAdd: functionCheck('1575053080863576064'),
  storeMiss: false,
  channelMiss: false
})

async function initCustomervisitPermission() {
  // 如果已经安装了G3客户拜访 则拜访失访按钮不受低码表单的功能点控制了
  if (Module.checkPermission({ modulekey: 'customervisit' })) {
    auths.storeVisit = true
    auths.channelVisit = true
    auths.storeMiss = await toGetMissPermission()
    auths.channelMiss = await toGetMissPermission()
  }
}
initCustomervisitPermission()

console.log('auths', auths)

const showAction = ref(false)

const actions = computed(() => {
  return [
    { name: '终端', key: '905324680615956480', className: storeType.value.key === '905324680615956480' ? 'xt-active-sheet' : '' },
    { name: '分销商', key: '905324761813487717', className: storeType.value.key === '905324761813487717' ? 'xt-active-sheet' : '' }
  ]
})

const resetCustomerType = () => {
  storeType.value = {}
  showAction.value = false
  onSearch1()
}

const onSelectType = (action) => {
  storeType.value = action
  showAction.value = false
  console.log('action', action)
  onSearch1()
}

const list1 = ref([])
const loading1 = ref(false)
const finished1 = ref(false)
const refreshing1 = ref(false)
const pageIndex1 = ref(-1)
const searchText1 = ref('')

const list2 = ref([])
const loading2 = ref(false)
const finished2 = ref(false)
const refreshing2 = ref(false)
const pageIndex2 = ref(-1)
const searchText2 = ref('')

const visitStatusMap = {
  1: '待拜访',
  2: '拜访中',
  3: '已完成'
}

const columns = [
  { text: '全部', key: '' },
  { text: '终端客户', key: '905324680615956480' },
  { text: '分销客户', key: '905324761813487717' }
]


const onLoad1 = async () => {
  loading1.value = true
  if (refreshing1.value) {
    list1.value = []
    refreshing1.value = false
    finished1.value = false
    pageIndex1.value = -1
  }
  pageIndex1.value++
  let latitude = ''
  let longitude = ''
  try {
    const loc = await getLocation()
    console.log(loc)
    if (loc) {
      const { longitude: lng, latitude: lat } = loc
      latitude = lat
      longitude = lng
    }
  } catch (e) {
    console.log(e)
  }
  const res = await axios.post('/api/teapi/dy-biz/893405830819483679/1803669859654045781', {
    kx_kq_store: {
      approvestatus: '1',
      status: '1',
      storename: searchText1.value,
      customertype: storeType.value.key,
      latitude,
      longitude
    },
    __paging: {
      __pageindex: `${pageIndex1.value}`,
      __pagesize: '20'
    }
  })
  list1.value = list1.value.concat(res.data.resp_data.kx_kq_store.map(store => {
    return {
      ...store,
      title: store.storename,
      address: store.address ? JSON.parse(store.address).address : '',
      man: store.presentative__representativeid__orgname ? store.presentative__representativeid__orgname.replace(/;/g, '、') : '暂无负责人',
      storeimg: store.storeimg ? JSON.stringify((JSON.parse(store.storeimg)[0])) : '',
      // recentvisittime: store.recentvisittime ? dayjs(+store.recentvisittime).format('YYYY-MM-DD HH:mm:ss') : '',
      visitstatusText: store.visitstatus ? visitStatusMap[store.visitstatus] : '待拜访'
    }
  }))
  loading1.value = false
  if (list1.value.length >= +res.data.resp_data.__paging.__itemcount || res.data.resp_data.kx_kq_store.length < 20) {
    finished1.value = true
  }
}
onLoad1()

const onSearch1 = () => {
  list1.value = []
  finished1.value = false
  pageIndex1.value = -1
  loading1.value = true
  onLoad1()
}

const onLoad2 = async () => {
  loading2.value = true
  if (refreshing2.value) {
    list2.value = []
    refreshing2.value = false
    finished2.value = false
    pageIndex2.value = -1
  }
  pageIndex2.value++
  let latitude = ''
  let longitude = ''
  try {
    const { longitude: lng, latitude: lat } = await getLocation()
    latitude = lat
    longitude = lng
  } catch (e) {
    console.log(e)
  }
  const res = await axios.post('/api/teapi/dy-biz/893405830819483676/1808677261113692250', {
    ka_kq_channelcustomers: {
      approvestatus: '1',
      status: '1',
      storename: searchText2.value,
      latitude,
      longitude
    },
    __paging: {
      __pageindex: `${pageIndex2.value}`,
      __pagesize: '20'
    }
  })
  list2.value = list2.value.concat(res.data.resp_data.ka_kq_channelcustomers.map(store => {
    return {
      ...store,
      title: store.channelname,
      address: store.address ? JSON.parse(store.address).address : '',
      man: store.bizmanager__managerid__orgname ? store.bizmanager__managerid__orgname.split(';').join('、') : '暂无负责人',
      storeimg: store.storeimg ? JSON.stringify((JSON.parse(store.storeimg)[0])) : '',
      recentvisittime: store.recentvisittime ? dayjs(store.recentvisittime).format('YYYY-MM-DD HH:mm:ss') : '暂未拜访',
      visitstatusText: store.visitstatus ? visitStatusMap[store.visitstatus] : '待拜访'
    }
  }))
  loading2.value = false

  if (list2.value.length >= +res.data.resp_data.__paging.__itemcount || res.data.resp_data.ka_kq_channelcustomers < 20) {
    finished2.value = true
  }
}
onLoad2()

const onSearch2 = () => {
  list2.value = []
  finished2.value = false
  pageIndex2.value = -1
  loading2.value = true
  onLoad2()
}

const onRefresh1 = () => {
  pageIndex1.value = -1
  list1.value = []
  finished1.value = false
  loading1.value = true
  onLoad1()
}

const onRefresh2 = () => {
  pageIndex2.value = -1
  list2.value = []
  finished2.value = false
  loading2.value = true
  onLoad2()
}

onActivated(() => {
  console.log('onActivated')
  console.log('refreshList', sessionStorage.getItem('refreshList'))
  if (sessionStorage.getItem('refreshList') === '1') {
    customerType.value === '1' ? onRefresh1() : onRefresh2()
    sessionStorage.setItem('refreshList', '0')
  }
})

const toDetail = (store, type) => {
  const pagecode = type === '1' ? '1562754942865903616' : '1563003724761272320'
  router.push(`/page/${pagecode}?storeid=${store.id}&customertype=${store.customertype}`)
}

const toVisit = (store) => {
  // debugger
  console.log(store)
  start({
    customerid: store.id,
    saleareaid: store.seleareaid,
    customertype: store.customertype,
    customername: store.customertype === '905324761813487616' ? store.channelname : store.storename,
    storedetailpagecode: '1562754942865903616',
    channeldetailpagecode: '1563003724761272320'
  })
}

const toMiss = (store) => {
  // debugger
  console.log(store)
  miss({
    customerid: store.id,
    saleareaid: store.seleareaid,
    customertype: store.customertype,
    customername: store.customertype === '905324761813487616' ? store.channelname : store.storename
  })
}

const toAdd = (type) => {
  if (type === 'zd') {
    router.push({
      path: '/page/1563916399171211264',
      query: {
        customertype: '905324680615956480',
        pagetitle: '新增终端',
        __pagestatus: '1'
      }
    })
  } else if (type === 'fxs') {
    router.push({
      path: '/page/1563916399171211264',
      query: {
        customertype: '905324761813487717',
        pagetitle: '新增分销商',
        __pagestatus: '1'
      }
    })
  } else if (type === 'jxs') {
    router.push({
      path: '/page/1564805059064238080',
      query: {
        pagetitle: '新增经销商',
        __pagestatus: '1'
      }
    })
  }
}
</script>
<script>
const ListItem = ({ item, type, visit, miss, authVisit, authMiss }) => {
  return (
    <div class="customer-list-item">
      <div class="item-header">
        {type === '1' && (
          <div class={['store-type-icon', item.customertype === '905324761813487717' ? 'bg-fenxiaoshang' : 'bg-zhongduan']}>
            {item.customertype === '905324761813487717' ? '分' : '终'}
          </div>
        )}
        {type === '2' && (
          <div class={['store-type-icon', 'bg-jingxiaoshang']}>
            经
          </div>
        )}
        <div class="title">{item.title}</div>
        <div class="distance">{item.distance ? (+item.distance > 1 ? ((+item.distance).toFixed(2) + 'KM') : (((+item.distance) * 1000).toFixed(2) + 'M')) : '未知距离'}</div>
      </div>
      <div class="item-body">
        <div class="item-top">
          <div class="right">
            <div class="tag-wrap">
              <van-tag type="primary" style="height:18px;box-sizing:border-box" class="tag" color="#FEF4EC" text-color="#7C3F19">{item.channeltype__dicvalue}</van-tag>
              {item.storelevel__dicvalue && (
                <van-tag type="primary" class="tag" style="height:18px;box-sizing:border-box" color="#FEF4EC" text-color="#7C3F19">{item.storelevel__dicvalue}</van-tag>
              )}
            </div>
            <div class="info-wrap">
              <div class="row">
                <div class="label"><i class="h5iconfont h5icon-address icon" style="color:#303133;font-size:16px" /></div>
                <div class="value">{item.address}</div>
              </div>
              <div class="row">
                <div class="label">
                  <i class="h5iconfont h5icon-list_salesman icon" style="color:#303133;font-size:16px" />
                </div>
                <wxworksuite-opendata class="wxvalue" ref="wxworksuiteopendataRef" type="expression" openid={item.man}></wxworksuite-opendata>
              </div>
              <div class="row">
                <div class="label"><i class="h5iconfont h5icon-list_visit-time-text icon" style="color:#303133;font-size:16px" /></div>
                <div class="value">
                  <span>{item.recentvisittime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default {
  components: {
    'list-item': ListItem
  }
}
</script>
<style lang="stylus">
.xt-active-sheet
  background-color rgba(0, 0, 0, 0.1) !important
.customer-list-page-unique
  .van-tabs__wrap
    background #1A85FF
    height 48px
    .van-tabs__nav
      height 100%
      margin-top 8px
      height 40px
      border none
    .van-tabs__nav--card
      border none
      background linear-gradient( 180deg, #1A85FF 0%, rgba(26,133,255,0.8) 100%)
    .van-tab--card
      background: linear-gradient( 180deg, #1A85FF 0%, rgba(26,133,255,0.8) 100%)
      border-radius 8px 8px 0 0
      border none
      font-weight 600
      font-size 16px
    #van-tabs-1-0.van-tab--active::after
      content ''
      width 15px
      height 37px
      position absolute
      box-sizing border-box
      right -14px
      top 4px
      background linear-gradient(180deg, #FEFEFE 0%, #F6F6F6 100%)
      clip-path polygon(0% 0%, 100% 100%, 0% 100%, 0% 100%)
      z-index 99
    #van-tabs-1-1.van-tab--active::before
      content ''
      width 15px
      height 37px
      position absolute
      box-sizing border-box
      left -14px
      top 4px
      background linear-gradient(180deg, #FEFEFE 0%, #F6F6F6 100%)
      clip-path polygon(0% 0%, 100% 100%, 0% 100%, 0% 100%)
      z-index 99
      transform rotateY(180deg)
    .van-tab--active
      background linear-gradient( 180deg, #FFFFFF 0%, #F6F6F6 100%)
      border none
      font-weight 600
      font-size 16px
  .van-tabs__content
    height calc(100% - 48px)
  div
    box-sizing border-box
  .add-btn
    position fixed
    right 8px
    bottom 0
    z-index 8
  .filter-wrap
    display flex
    padding 0 12px
    background #F6F6F6
    .search-wrap
      padding 8px 0
      flex 1
    .input-wrap
      height 32px
      margin 4px 0
      padding 4px
      background #FFFFFF
      display flex
      align-items center
      border-radius 16px
      box-shadow 0px 0px 4px 0px rgba(0,0,0,0.16)
      input
        box-sizing border-box
        flex 1
        width 100%
        height 100%
        background #FFFFFF
        border none
        padding-left 4px
        font-size 14px
        margin-top 1px
        vertical-algin center
        &::-webkit-input-placeholder
          color #999999
    .select-wrap
      height 56px
      width 115px
      margin-left 10px
      display flex
      flex-direction column
      justify-content center
      text-align center
      font-size 15px
      color #323233
      .select-content
        color #969799
        font-size 14px
        border-radius 16px
        background #FFFFFF
        height 32px
        line-height 32px
        box-shadow 0px 0px 4px 0px rgba(0,0,0,0.16)
  .customer-list-content
    padding 0 12px 12px 12px
    background #F6F6F6
    height calc(100% - 56px)
    overflow auto
  .customer-list-item
    padding-top 12px
    border-radius 8px
    background #ffffff
    margin-bottom 8px
    .item-header
      display flex
      align-items flex-start
      padding 0 8px
      .store-type-icon
        width 16px
        height 16px
        font-size 10px
        text-align center
        line-height 16px
        border-radius 2px
        color #ffffff
        margin-right 4px
        margin-top 3px
      .bg-fenxiaoshang
        background #09AA57
      .bg-jingxiaoshang
        background #FE7233
      .bg-zhongduan
        background #1A85FF
      .mr-8
        margin-right 8px
      .title
        flex 1
        font-size 16px
        color #333333
        text-overflow -o-ellipsis-lastline
        overflow hidden				//溢出内容隐藏
        text-overflow ellipsis		//文本溢出部分用省略号表示
        display -webkit-box			//特别显示模式
        -webkit-line-clamp 2			//行数
        line-clamp 2					
        -webkit-box-orient vertical	//盒子中内容竖直排列
        margin-right 4px
      .distance
        font-size 12px
        color #6C6C6C
        padding-top 3px
    .item-body
      padding 2px 8px 6px
      .item-top
        display flex
        .right
          flex 1
          display flex
          flex-direction column
          justify-content space-between
          padding-left 20px
          .info-wrap
            padding 2px 0 10px 0
          .tag-wrap
            .tag
              margin-right 8px
              font-size 10px
              padding 2px 4px
          .row
            display flex
            align-items center
            font-size 12px
            line-height 16px
            color #6C6C6C
            margin-top 4px
            .wxvalue
              margin-left 4px
              display flex
              align-items center
              vertical-align middle
              flex-wrap wrap
              padding-top 3px
            .value
              flex 1
              margin-left 4px
              display flex
              justify-content space-between
              align-items center
              vertical-align middle
              padding-top 3px
              word-break break-word
              .visit-status
                algin-self flex-end
                color #F99D14
                &-1
                  color #F99D14
                &-2
                  color #1A85FF
                &-3
                  color #3AC892
            .icon
              position relative
              top 2px
              color #999999
    .item-footer
      display flex
      border-top 1px solid #F4F6F8
      .btn
        border none
      .border-right
        border-right 1px solid #F4F6F8
        border-color #F4F6F8 !important
.customer-list-page-unique-bottombtn
  width 100%
  display flex
  justify-content center
  box-sizing border-box
  background-color #F6F6F6
  padding 8px 12px 16px
  .van-button
    flex 1
    // margin 8px 6px 8px 6px
    border-radius 20px
    box-sizing border-box
    height 40px
</style>
