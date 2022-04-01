import { defineConfig } from 'vite';
import path from 'path';
import { createVuePlugin } from 'vite-plugin-vue2';
import envCompatible from 'vite-plugin-env-compatible';
import { injectHtml } from 'vite-plugin-html';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @import '@/assets/scss/variable.scss';
        @import '@/../colony-vue/src/assets/scss/variable.scss';
        @import '@/assets/scss/button.scss';
        @import '@/assets/scss/contents.scss';
        @import '@/assets/scss/form.scss';
        @import '@/assets/scss/modal.scss';
        @import '@/assets/scss/reset.scss';
        @import '@/assets/scss/search.scss';
        @import '@/assets/scss/table.scss';
        @import '@/assets/scss/tooltip.scss';
        @import '@/assets/scss/tree.scss';
        @import '@/../colony-vue/src/assets/scss/common.scss';
        @import '@/../colony-vue/src/assets/scss/grid.scss';
        @import '@/../colony-vue/src/assets/scss/reset.scss';
        `
      },
    },
  },
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: ''
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ],
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.vue'
    ]
  },
  plugins: [
    createVuePlugin({ jsx: true }),
    viteCommonjs(),
    envCompatible(),
    injectHtml()
  ],
  build: {}
})
