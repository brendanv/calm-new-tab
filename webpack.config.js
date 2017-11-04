module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    filename: 'build/bundle.js'
  },
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
