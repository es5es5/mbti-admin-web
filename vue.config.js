const webpack = require('webpack')

// vue.config.js
module.exports = {
  publicPath: process.env.VUE_APP_BASE_URL || '/',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        moment: 'moment',
      })
    ]
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "~@/assets/scss/variable.scss";
        `
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    https: false,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
