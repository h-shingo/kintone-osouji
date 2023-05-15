var merge = require('webpack-merge');
var common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: ['./conf/conf.dev.js', './src/tsx/index.tsx'],
  mode: 'development',
  devtool: 'inline-source-map'
});
