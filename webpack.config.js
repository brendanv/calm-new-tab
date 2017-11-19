var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'main': ['babel-polyfill', './js/main.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: './js/[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'head',
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json' },
      { from: './css', to: './css' }
    ])
  ],
	module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  }
};
