'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {

  const mainConfig = {
    entry: {
      main: path.join(__dirname, '../src/main/index.ts')
    },
    module: {
      rules: [
        {
          test: /\.(ts|vue)$/,
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
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, '../dist')
    },
    plugins: [],
    resolve: {
      extensions: ['.js', '.json', '.ts']
    },
    node: {
      __dirname: false
    },
    target: 'electron-main'
  }
  
  /**
   * Adjust mainConfig for production settings
   */
  if (argv.mode === 'production') {
    mainConfig.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      })
    )
  }
  
  return mainConfig;
  
}
