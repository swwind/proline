'use strict';

const path = require('path');
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {

  const rendererConfig = {
    entry: {
      renderer: path.join(__dirname, '../src/renderer/main.ts')
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
          test: /\.scss$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.html$/,
          use: 'vue-html-loader'
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            transpileOnly: true,
          }
        },
        {
          test: /\.vue$/,
          use: {
            loader: 'vue-loader',
            options: {
              esModule: true,
              extractCSS: argv.mode === 'production',
              loaders: {
                scss: 'vue-style-loader!css-loader!sass-loader'
              }
            }
          }
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              name: 'imgs/[name]--[folder].[ext]'
            }
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name]--[folder].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              name: 'fonts/[name]--[folder].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../src/index.ejs'),
        minify: {
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          removeComments: true
        },
        nodeModules: argv.mode !== 'production'
          ? path.resolve(__dirname, '../node_modules')
          : false
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/static')
        }
      ]),
    ],
    output: {
      filename: '[name].js',
      path: path.join(__dirname, '../dist'),
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, '../src/renderer'),
        'vue$': 'vue/dist/vue.esm.js'
      },
      extensions: ['.js', '.vue', '.json', '.css', '.node', '.ts'],
    },
    target: 'electron-renderer',
  };
  
  /**
   * Adjust rendererConfig for development settings
   */
  if (argv.mode !== 'production') {
    rendererConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  
  return rendererConfig;
  
}
