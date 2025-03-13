# @smart100/service-plugin

## 要求

- node >= 18.15.0
- use npm

## 发布

- 修改代码
- 修改 package.json 版本号
- 执行 npm i 同步版本号到 package-lock.json 文件
- 执行 npm run build 构建打包文件到 dist 目录
- 执行 npm publish

## todo

- 路由跳转时检测 token 过期则更新
- axios 支持 错误弹窗
- spuConfig 支持保存
- 控件用 lit 改写
- spu-test 控件
- 弹窗控件
