const path = require('path');

module.exports = {
  entry: {
    core: path.join(__dirname, '../src/core/index.ts')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.json', '.ts']
  },
  node: {
    __dirname: false
  },
  target: 'electron-main'
}
