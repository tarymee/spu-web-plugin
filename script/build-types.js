// import path from 'path'
// import { fileURLToPath } from 'url'
import * as fs from 'fs'


// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// // console.log(__filename)
// // console.log(__dirname)
// // console.log(path.resolve(__dirname, '../src/types/index.d.ts'))

// const source = path.resolve(__dirname, '../src/types/index.d.ts')
// const target = path.resolve(__dirname, '../dist/index.d.ts')
// fs.copyFileSync(source, target)




const distDir = 'dist'
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}
fs.copyFileSync('src/types/index.d.ts', 'dist/index.d.ts')
