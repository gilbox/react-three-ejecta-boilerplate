var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3420',
    'webpack/hot/dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'web'),
    filename: 'static/bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel?stage=0'],
      include: path.join(__dirname, 'src')
    }]
  }
};
