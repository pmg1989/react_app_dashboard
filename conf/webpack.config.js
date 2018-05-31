const webpack = require('atool-build/lib/webpack')
const path = require('path')

module.exports = function (webpackConfig, env) {
  webpackConfig.babel.plugins.push('transform-runtime')
  webpackConfig.babel.plugins.push(['import', {
    libraryName: 'antd',
    style: true
  }])

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = 'eval'
    webpackConfig.babel.plugins.push(['dva-hmr', {
      entries: [
        './src/index.js'
      ]
    }])
  } else {
    webpackConfig.devtool = 'source-map'
    webpackConfig.babel.plugins.push('dev-expression')
    webpackConfig.entry = {
      index: './src/index.js',
      // common: [ 'react', 'react-dom', 'classnames', 'antd', 'dva', 'qs', 'js-cookie', 'moment', 'rc-queue-anim', 'rc-tween-one']
    }
  }
  //mock data config
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'newband.app.admin.ISMOCK': false,
    'newband.app.admin.IS_DYNAMIC_LOAD': false,
    'newband.app.admin.API_HOST': JSON.stringify('http://192.168.1.202:8082/'),
    'newband.app.admin.CLIENT_ID': JSON.stringify('1_g8jkp9mm6mg4c4goo0gokc0o084004k8s4o0oks0gcs0w0cw4'),
    'newband.app.admin.CLIENT_SECRET': JSON.stringify('sga0vq93bnkw4w0880kwgo0cc0ok4ok8ogogwkg4wosk00w0w'),
    'newband.app.admin.GRANT_TYPE': JSON.stringify('client_credentials')
  }))

  // Don't extract common.js and common.css
  webpackConfig.plugins = webpackConfig.plugins.filter(function (plugin) {
    return !(plugin instanceof webpack.optimize.CommonsChunkPlugin)
  })

  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.include = /node_modules/
      loader.test = /\.less$/
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/
      loader.test = /\.less$/
    }
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
      loader.include = /node_modules/
      loader.test = /\.css$/
    }
    if (loader.test.toString() === '/\\.module\\.css$/') {
      loader.exclude = /node_modules/
      loader.test = /\.css$/
    }
  })

  return webpackConfig
}
