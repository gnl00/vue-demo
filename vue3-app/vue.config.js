const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/web',
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      proxy: {
        '/web': {
          target: 'http://localhost:8080/web',
          crossOrigin: true,
          ws: true,
          pathRewrite: {
            '^/web': ''
          }
        }
      }
    }
  }
})
