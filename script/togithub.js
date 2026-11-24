import { execFileSync } from 'child_process'
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_ROOT = path.resolve(__dirname, '..')
const DEST_ROOT = 'F:/person/spu-web-plugin-github'

const TOP_LEVEL_EXCLUDED = new Set(['.git', 'node_modules', 'dist', '.DS_Store'])
const ANY_LEVEL_EXCLUDED = new Set(['.git', 'node_modules', '.DS_Store'])

function copyFilter(src) {
  const rel = path.relative(SRC_ROOT, src)
  if (!rel) return true
  const segments = rel.split(path.sep)
  if (segments.some(name => ANY_LEVEL_EXCLUDED.has(name))) return false
  if (segments[0] === 'dist') return false
  return true
}

const deletedEntries = []

function mirrorDelete(destDir, srcDir, isTopLevel) {
  for (const name of readdirSync(destDir)) {
    if (isTopLevel && TOP_LEVEL_EXCLUDED.has(name)) continue
    if (!isTopLevel && (name === '.git' || name === 'node_modules')) continue
    const destPath = path.join(destDir, name)
    const srcPath = path.join(srcDir, name)
    if (!existsSync(srcPath) || statSync(srcPath).isDirectory() !== statSync(destPath).isDirectory()) {
      rmSync(destPath, { recursive: true, force: true })
      deletedEntries.push(path.relative(DEST_ROOT, destPath))
      continue
    }
    if (statSync(srcPath).isDirectory()) mirrorDelete(destPath, srcPath, false)
  }
}

function git(args, options = {}) {
  const out = execFileSync('git', ['-C', DEST_ROOT, ...args], { encoding: 'utf8', ...options })
  return typeof out === 'string' ? out.trim() : ''
}

if (!existsSync(DEST_ROOT) || !existsSync(path.join(DEST_ROOT, '.git'))) {
  console.error(`[togithub] 目标仓库不存在或不是 git 仓库: ${DEST_ROOT}`)
  process.exit(1)
}

console.log(`[togithub] 同步 ${SRC_ROOT} -> ${DEST_ROOT}`)

mirrorDelete(DEST_ROOT, SRC_ROOT, true)
if (deletedEntries.length) {
  console.log(`[togithub] 删除源仓库已不存在的条目:\n  - ${deletedEntries.join('\n  - ')}`)
}

cpSync(SRC_ROOT, DEST_ROOT, { recursive: true, filter: copyFilter })
console.log('[togithub] 拷贝完成')

git(['add', '-A'])
const status = git(['status', '--porcelain'])
const now = new Date()
const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`

if (status) {
  git(['commit', '-m', `feat: 同步${yyyymmdd}`], { stdio: 'ignore' })
  console.log(`[togithub] 已提交: feat: 同步${yyyymmdd}`)
} else {
  console.log('[togithub] 无变动，跳过提交')
}

execFileSync('git', ['-C', DEST_ROOT, 'push', 'origin', 'main'], { stdio: 'inherit' })
console.log('[togithub] 已推送到 origin main')
