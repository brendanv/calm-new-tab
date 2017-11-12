var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: {
    'bundle': ['babel-polyfill', './src/js/main.js'],
  },
  output: {
    filename: 'build/js/[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'build/manifest.json' },
      { from: 'src/index.html', to: 'build/index.html' },
      { from: 'src/css', to: 'build/css' }
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
