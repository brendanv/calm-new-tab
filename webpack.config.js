var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

function buildManifest(browser) {
  var isChrome = browser == 'chrome';

  var permissions = ['storage'];
  if (!isChrome) {
    permissions.push('unlimitedStorage');
  }

  var manifest = {
    manifest_version: 2,
    name: "Calm New Tab",
    author: "Brendan Viscomi",
    version: "0.1",
    description: "Replace your new tab page with a relaxing photo. No frills, no tracking, open source.",

    homepage_url: "https://github.com/brendanv/calm-new-tab",

    chrome_url_overrides: {
      newtab: "index.html"
    },

    options_ui: {
      page: "options.html",
      [isChrome ? 'chrome_style' : 'browser_style']: true
    },

    permissions: permissions
  };

  if (!isChrome) {
    manifest.applications = {
      gecko: {
        id: "{ad9acb11-1016-4d4a-bc70-6b3ba7c53981}"
      }
    };
    manifest.developer = {
      name: "Brendan Viscomi",
      url: "https://github.com/brendanv/calm-new-tab"
    };
  }

  return manifest;
}

function getConfig(browser) {
  var buildDir = 'build/' + browser;
  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      'main': ['babel-polyfill', './js/main.js'],
      'options': ['babel-polyfill', './js/options.js'],
    },
    output: {
      path: path.resolve(__dirname, buildDir),
      filename: './js/[name].bundle.js'
    },
    plugins: [
      new CleanWebpackPlugin([buildDir]),
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
      new WebpackExtensionManifestPlugin({
        config: {
          base: buildManifest(browser)
        }
      })
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
}

module.exports = [
  getConfig('chrome'),
  getConfig('firefox'),
];
