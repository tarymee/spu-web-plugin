# Tasks

## 1. 同步脚本实现

- [x] 1.1 创建 `script/togithub.js`：实现前置校验（目标目录存在且含 `.git`，否则报错退出）、镜像拷贝（`fs.cpSync` + 过滤 `.git` / `node_modules` / 根级 `dist` / `.DS_Store`）；用 `node script/togithub.js` 确认无语法错误（实际同步验证由用户手动执行）
- [x] 1.2 在脚本中实现镜像删除逻辑：遍历目标仓库条目，源仓库无对应路径的整体删除（跳过 `.git` / 根级 `node_modules` / 根级 `dist` / `.DS_Store`，递归进入两边都存在的目录时同样跳过其中的 `node_modules`）
- [x] 1.3 在脚本中实现 git 流程：`git -C <目标> add -A` → `status --porcelain` 非空则 `commit -m "feat: 同步YYYYMMDD"`（为空则打印"无变动，跳过提交"）→ 始终 `push origin main`；用 eslint 校验 `script/togithub.js` 通过

## 2. 命令注册

- [x] 2.1 `package.json` 的 `scripts` 增加 `"togithub": "node script/togithub.js"`；用 eslint 校验 `package.json` 通过（JSON 无 lint 错误即通过）

## 3. 集成验证（用户手动执行）

- [x] 3.1 运行 `npm run togithub`：确认目标仓库 `service-plugin/` 被整体删除、目标仓库 `node_modules` 与 `docs/node_modules` 保留、`openspec/` 被同步、产生 `feat: 同步YYYYMMDD` 提交并推送到 `origin main`
- [x] 3.2 再次运行 `npm run togithub`：确认输出"无变动，跳过提交"，推送为 no-op 且不报错

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
