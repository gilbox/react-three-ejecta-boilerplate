var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'web/build/app.bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        loader: 'babel-loader?stage=0',
        exclude: /node_modules/ }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true
  },
  devtool: 'inline-source-map'
};
