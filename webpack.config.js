var path = require('path');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

function buildManifest(browser) {
  var isChrome = browser == 'chrome';
  var manifest = {
    manifest_version: 2,
    name: "Calm New Tab",
    version: "0.1",
    description: "Simple extension to replace your new tab page with a relaxing photo.",

    chrome_url_overrides: {
      newtab: "index.html"
    },

    options_ui: {
      page: "options.html",
      [isChrome ? 'chrome_style' : 'browser_style']: true
    },

    permissions: [
      "storage"
    ]
  };

  if (!isChrome) {
    manifest.applications = {
      gecko: {
        id: "calmtab@exampleID"
      }
    }
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
