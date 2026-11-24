# Spec Delta

## Purpose

提供 `npm run togithub` 命令，将本仓库（GitLab 内部仓库）的内容镜像同步到本地 GitHub 仓库并自动提交推送，替代手动"拷贝 → 提交 → 推送"流程。

## ADDED Requirements

### Requirement: 镜像同步源内容到目标仓库

运行 `npm run togithub` 时，系统 SHALL 将源仓库根目录的全部内容拷贝并覆盖到目标仓库（`F:\person\spu-web-plugin-github`），使目标仓库的工作区文件与源仓库一致。

#### Scenario: 新增与修改文件的同步

- **WHEN** 源仓库存在目标仓库没有的文件，或源仓库文件内容与目标仓库不同
- **THEN** 这些文件被拷贝到目标仓库的对应路径（覆盖旧内容，保留目录结构）

#### Scenario: 同步范围排除版本控制忽略项

- **WHEN** 执行同步
- **THEN** 源仓库的 `.git`、`node_modules`（任意层级）、根级 `dist`、`.DS_Store` 不被拷贝；目标仓库已存在的对应排除项保持原样（如目标仓库的 `node_modules`、`docs/node_modules` 不被动，无需重装依赖）

### Requirement: 镜像删除源仓库已不存在的文件

同步完成后，目标仓库中源仓库已不存在的文件 SHALL 被删除，使目标仓库内容为源仓库的精确快照。

#### Scenario: 源仓库已删除的文件从目标仓库移除

- **WHEN** 某文件或目录在源仓库不存在（例如已整体迁走的 `service-plugin/`）
- **THEN** 该文件或目录从目标仓库被整体删除（包括目录内部的一切内容）

#### Scenario: 排除项不参与删除判定

- **WHEN** 执行删除判定
- **THEN** 目标仓库根级的 `.git`、`node_modules`、`dist`、`.DS_Store` 不被删除

### Requirement: 自动提交并推送目标仓库

拷贝与删除完成后，系统 SHALL 在目标仓库执行 `git add -A`，并在存在变动时以 `feat: 同步YYYYMMDD` 格式（YYYYMMDD 为当天日期）创建提交，随后推送到 `origin main`。

#### Scenario: 有变动时提交并推送

- **WHEN** 同步在目标仓库产生了变动
- **THEN** 目标仓库创建一个 `feat: 同步YYYYMMDD` 格式的提交，并推送到 `origin main`

#### Scenario: 推送失败可重试

- **WHEN** 推送失败（如网络或 SSH 问题），提交已完成但未推送
- **THEN** 命令报错退出；再次运行 `npm run togithub` 时，无新变动则跳过提交但重新执行推送，完成上次未推送的内容

### Requirement: 无变动时跳过提交

当同步后目标仓库无任何变动时，系统 SHALL 跳过创建提交（避免空提交报错），推送仍执行（无新提交时为幂等操作）。

#### Scenario: 无变动

- **WHEN** 同步后目标仓库 `git status` 无任何变动
- **THEN** 不创建提交，输出"无变动"提示，推送照常执行

### Requirement: 同步前置校验

执行同步前，系统 SHALL 校验目标仓库目录存在且为有效 git 仓库，不满足时报错退出且不执行任何同步操作。

#### Scenario: 目标仓库不存在

- **WHEN** 目标目录 `F:\person\spu-web-plugin-github` 不存在或不是 git 仓库
- **THEN** 命令报错退出，目标仓库与源仓库均不被修改
