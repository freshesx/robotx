import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue2'
import scss from 'rollup-plugin-scss'
import eslint from 'rollup-plugin-eslint'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/main.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    vue(),
    scss({
      output: 'dist/main.css'
    }),
    eslint(),
    json(),
    babel({
      plugins: [
        'external-helpers'
      ]
    })
  ],
  external: [
    'vue',
    'element-ui',
    'vuex',
    'vue-router',
    'mobx',
    'vue-mobx'
  ]
}
