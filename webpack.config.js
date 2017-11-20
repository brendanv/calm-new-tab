var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'main': ['babel-polyfill', './js/main.js'],
    'options': ['babel-polyfill', './js/options.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: './js/[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: 'options.html',
      inject: 'body',
      chunks: ['options'],
    }),
    new CopyWebpackPlugin([
      { from: './manifest.json' },
    ])
  ],
	module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'flow', 'react'],
            plugins: ["transform-object-rest-spread", "transform-class-properties"]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
