# @smart100/spu-web-plugin

## 要求

- node >= 18.15.0 [用 20.10.0 也没问题]
- use npm only, not yarn or pnpm

## 发布

- 修改代码
- 修改 package.json 版本号
- 执行 npm i 同步版本号到 package-lock.json 文件
- 执行 npm run build 构建打包文件到 dist 目录
- 执行 npm login 按 enter 或 点击终端给出的链接到浏览器登录
- 执行 npm whoami 验证
- 执行 npm publish 发布 按 enter 或 点击终端给出的链接到浏览器授权
- 发布成功

## todo

- 路由跳转时检测 token 过期则更新
- axios 支持 错误弹窗？
- spuConfig 支持保存
- 控件用 lit 改写
- 弹窗控件
- 将wxworksuite-plugin代码迁移过来 废弃wxworksuite-plugin仓库
