import { defineConfig } from 'vite'
import * as path from "path";
import Unocss from 'unocss/vite'
// unoCSS preset
// check link https://github.com/unocss/unocss/tree/main/packages/preset-uno
// import presetUno from '@unocss/preset-uno'

// make unocss support @apply directive just like tailwindCSS
// check link: https://github.com/unocss/unocss/tree/main/packages/transformer-directives
import transformerDirective from '@unocss/transformer-directives'

const name = 'pure-whiteboard'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2015',
    lib: {
      entry: path.resolve(__dirname, './src/index.js'),
      name: name,
      // final result will like: pure-whiteboard.es.js or pure-whiteboard.umd.js
      fileName: format => `${name}.${format}.js`
    }
  },
  plugins: [
    Unocss({
      // presetUno: [
      //   presetUno(),
      // ]
      transformers: [
        transformerDirective()
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
})
