var merge = require('webpack-merge')

var leanCloudConfig = require('./leancloud')
var prodEnv = {
  NODE_ENV: '"production"',
  BASE_URL: '"https://dongsuo.leanapp.cn"'
}
prodEnv = merge(prodEnv, leanCloudConfig)

module.exports = prodEnv
