# 更新日志

## v1.0.17

- feature: 优化定位逻辑：优先地图商定位-失败再启用浏览器定位

## v1.0.16

- feature: 云存储支持复制功能
- feature: 云存储-华为云生成文件链接默认去除:80 或者 :443 端口号

## v1.0.15

- feature: 优化地图商功能

## v1.0.14

- feature: 优化地图商功能 key 没填时报错

## v1.0.13

- feature: 优化地图商切换逻辑 支持腾讯地图商 sk

## v1.0.12

- feature: 定位服务区分精确定位和兼容 ip 定位

## v1.0.11

- feature: 优化地图商切换服务 mapService 兼容支持同时执行多次初始化函数

## v1.0.10

- feature: 优化地图商切换服务 mapService

## v1.0.9

- feature: 支持地图商切换服务 mapService 【百度，腾讯，高德】

## v1.0.8

- fix: 单点登录写入 token 后需重新计算刷新 token 的时间

## v1.0.7

- feature: 支持单点登录回调 singleLoginCallback

## v1.0.6

- feature: 单点登录成功之后获取环境信息和租户配置信息 以及设置 tecode
- feature: axios 支持配置是否传 tecode

## v1.0.5

- fix: 修复刷新 token 接口时不用弹 loadding 窗的问题

## v1.0.4

- feat: 请求刷新 token 接口时传递 headers.tecode 以便根据租户的 token 过期设置返回正确的值
- feat: 优化刷新 token 机制

## v1.0.3

- feat: 优化云储存引用 ossclient 方法 支持上传后返回 storage
- fix(#66015): app 定位改成 30 秒超时
- fix(#64389): 兼容 web 引擎开发者模式设置 isdebugger
- fix: web 引擎端开发者模式不开启 vconsole

## v1.0.0

- feat(#22295): 玄瞳域名修改

## v0.0.38

- feat: 调试模式下 axios 加 debug: true 请求头
- feat: 支持 isdebugger 和 isvirtuallocation 方法
- feat: 存储支持 minio

## v0.0.37（取消发版）

- feat: 调试模式下 axios 加 debug: true 请求头
- feat: 支持 isdebugger 和 isvirtuallocation 方法
- feat: 存储支持 minio

## v0.0.36

- 初始化
