var webpack = require('webpack');

console.log('process.env.NODE_ENV:',process.env.NODE_ENV);

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: 'App/index.js'
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
  devtool: null,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};
