# Design

## Context

- 源仓库：本仓库（GitLab，branch `master`）；目标仓库：`F:\person\spu-web-plugin-github`（remote `git@github.com:tarymee/spu-web-plugin.git`，branch `main`）。
- 两仓库 git 历史完全独立（目标仓库是"快照式"同步产物，提交记录形如 `feat: 同步20251118`），因此不能通过 git remote 直接推送，只能快照拷贝。
- 两仓库 `.gitignore` 一致：`.DS_Store` / `node_modules` / `/dist`。`dist` 与 `node_modules` 在两边均为本地存在、未跟踪。
- 项目已有 `script/build-types.js` 的脚本先例，Node 版本 20.10（volta 固定）。

## Goals / Non-Goals

**Goals:**

- `npm run togithub` 一条命令完成：镜像拷贝 → 目标仓库 git add/commit/push。
- 镜像语义完整：源仓库删除的文件在目标仓库同步删除；排除项（`node_modules`/`dist` 等）在拷贝与删除两个方向都不参与。
- 失败可重试：push 失败后重跑命令能补推。

**Non-Goals:**

- 不做双向同步、不做增量历史合并（目标仓库历史保持独立）。
- 不改动插件构建、发布流程与运行时代码。
- 不做目标路径/远端参数化配置（个人机器专用工具，路径写死在脚本常量里）。

## Decisions

### D1: Node 脚本而非 robocopy / bash

- 选择：`script/togithub.js`（ESM，`package.json` 已是 `"type": "module"`）。
- 理由：跨平台（本机 Windows，但脚本逻辑可移植）、排除逻辑精确可控、与 `script/build-types.js` 风格一致。
- 备选：robocopy（语法晦涩、镜像参数 `/MIR` 与排除项交互不直观）、bash + rsync（Windows 无原生 rsync）。

### D2: 拷贝用 `fs.cpSync` + 过滤，不引第三方依赖

- 选择：`node:fs` 的 `cpSync(src, dest, { recursive: true, filter })`，Node 20 原生支持。
- 过滤规则（对任意路径组件）：
  - 目录名 `node_modules` → 跳过
  - 根级 `dist`、`.git` → 跳过
  - 文件 `.DS_Store` → 跳过
- 备选：自己写递归拷贝（无必要，cpSync 够用）、`fs-extra`（新增依赖，不值得）。

### D3: 删除用自写递归 diff，而非"清空后全量拷贝"

- 选择：遍历目标仓库根级条目（跳过 `.git` / 根级 `node_modules` / 根级 `dist` / `.DS_Store`）：
  - 源仓库无对应路径 → `fs.rmSync(entry, { recursive: true, force: true })` 整体删除（目录内的 `node_modules` 随之删除，如 `service-plugin/node_modules`）；
  - 两边都存在且为目录 → 递归对比其子条目（同样跳过其中的 `node_modules`）；
  - 两边都存在且为文件且源无此文件 → 删除。
- 理由："清空后全量拷贝"会误删目标仓库的 `node_modules` / `docs/node_modules`，导致每次同步后要重装依赖；diff 删除保留排除项。
- 注意：`docs/node_modules` 位于 `docs/` 下，`docs/` 两边都存在，递归进入时跳过其中的 `node_modules`，故保留。

### D4: git 操作用 `child_process.execSync` + `git -C <目标仓库>`

- 流程：
  1. 前置校验：目标目录存在且 `<目标>/.git` 存在，否则报错退出（不执行任何同步）。
  2. `git -C <目标> add -A`
  3. `git -C <目标> status --porcelain` 输出非空 → `git -C <目标> commit -m "feat: 同步$(YYYYMMDD)"`；为空 → 打印"无变动，跳过提交"。
  4. `git -C <目标> push origin main`（始终执行；无新提交时为 no-op，从而覆盖"上次 push 失败、本次补推"的场景）。
- commit message 日期用 `Date` 手写格式化，不引 dayjs（脚本独立于业务依赖）。
- 备选：`simple-git`（新增依赖，不值得）。

### D5: package.json 注册命令

- `scripts` 增加 `"togithub": "node script/togithub.js"`。

## Risks / Trade-offs

- [目标仓库存在用户未提交的本地改动] → `git add -A` 会将其一并打包进同步提交。接受：该仓库定位为单向快照镜像，用户同步前应保证其干净；文档（脚本输出）中提示。
- [源仓库中 `openspec/`、`README-DEV.md` 等内部内容被推到公开 GitHub] → 已由用户确认一起同步，接受。
- [硬编码绝对路径 `F:\person\spu-web-plugin-github`] → 换机器/换路径需改脚本常量。接受：个人专用工具，常量置于脚本顶部便于修改。
- [目标仓库被其他人/进程同时操作] → git 操作可能冲突。接受：单人使用场景。

## Migration Plan

无部署迁移。回滚 = 删除 `script/togithub.js` 与 `package.json` 中的 `togithub` 条目。

## Open Questions

（无）
