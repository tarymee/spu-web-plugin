import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import image from '@rollup/plugin-image'
import pkg from './package.json' assert { type: 'json' }
// const pkg = require('./package.json')


export default {
  input: 'src/index.ts', // 打包入口
  output: [
    {
      file: pkg.module,
      format: 'es',
      plugins: [
        terser()
      ]
    },
    // {
    //   file: pkg.browser,
    //   format: 'umd',
    //   name: 'spu-web-plugin',
    // },
    // {
    //   file: pkg.main,
    //   format: 'cjs',
    //   plugins: [
    //     // terser()
    //   ]
    // }
  ],
  plugins: [
    vue(),
    postcss(),
    image(),
    json(),
    typescript(),
    commonjs(),
    resolve({
      // 将自定义选项传递给解析插件
      moduleDirectories: ['node_modules'],
      // rollup中打包axios异常问题 https://juejin.cn/post/6854573211661631502
      browser: true
    }),
    babel({
      extensions: [
        '.js',
        '.ts',
        // '.jsx',
        // '.es',
        // '.mjs',
        // '.vue',
      ],
      // https://juejin.cn/post/7209262585005572153
      // https://www.jianshu.com/p/fe3319e0abc4
      babelHelpers: 'bundled',
      exclude: [
        'node_modules/**'
      ]
    })
  ],
  external: [
    // 'vconsole',
    'vue'
  ]
}
