# Proposal

## Why

本仓库（GitLab 内部仓库）与 GitHub 个人仓库（`F:\person\spu-web-plugin-github`，remote `tarymee/spu-web-plugin`）之间目前靠手动"拷贝 → 提交 → 推送"同步，流程繁琐且易漏（如源仓库删除的文件不会自动从目标仓库移除）。需要一个一键命令自动化该流程。

## What Changes

- 新增 `script/togithub.js`：将本仓库代码镜像同步到 `F:\person\spu-web-plugin-github`，并在目标仓库执行 git 提交与推送。
- `package.json` 新增 `togithub` 命令（`npm run togithub`）。
- 同步为**镜像语义**：目标仓库内容完全等于源仓库快照，源仓库已删除的文件（如 `service-plugin/`）在目标仓库一并删除。
- 同步排除 `.git` / `node_modules` / `dist`；`openspec/` 目录随源仓库一起同步。
- commit message 自动生成，沿用目标仓库现有风格（`feat: 同步YYYYMMDD`）；无变动时跳过 commit 与 push。

## Capabilities

### New Capabilities

- `github-mirror-sync`: 定义 `npm run togithub` 镜像同步命令的行为——拷贝范围与排除规则、镜像删除规则、git 提交与推送行为、无变动时的行为。

### Modified Capabilities

（无——项目目前没有任何已有 specs。）

## Impact

- 新增文件：`script/togithub.js`
- 修改文件：`package.json`（scripts 增加 `togithub`）
- 依赖的系统：目标仓库 `F:\person\spu-web-plugin-github`（本地路径必须存在）、其 remote `git@github.com:tarymee/spu-web-plugin.git`（SSH 推送）
- 不影响插件运行时行为（`src/`、构建产物、发布流程均不变）
