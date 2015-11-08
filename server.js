var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.web-dev');
var path = require('path');

new WebpackDevServer(webpack(config), {
  contentBase: path.join(__dirname, 'web'),
  publicPath: config.output.publicPath,
  historyApiFallback: true
}).listen(3420, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3420');
});
