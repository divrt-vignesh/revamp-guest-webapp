process.env.VUE_APP_VERSION = require('./package.json').version
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  // css: {
  //   extract: { ignoreOrder: true },
  // },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true
    }
  },
  pwa: {
    iconPaths: {
      favicon32: null,
      favicon16: null,
      appleTouchIcon: null,
      maskIcon: null,
      msTileImage: null
    },
    icons: null
  }

  // pwa: {
  //   themeColor: '#17a2b8',
  //   msTileColor: '#000000',
  //   iconPaths: {
  //     msTileImage: 'static/mstile-150x150.png'
  //   }
  // }
}