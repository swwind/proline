'use strict';

process.env.NODE_ENV = 'development';

const { exec } = require('child_process');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const { absPath } = require('./util');
const config = require('./config');

/* eslint-disable no-console */

// Press Ctrl-C to exit
process.on('SIGINT', () => {
  console.log('\nCtrl-C Pressed. Exiting...\n');
  electron.kill();
  process.exit(0);
});

const electron = exec([
  'electron',
  absPath('/src/main/index.dev.js'),
  '--inspect=5858',
  '--remote-debugging-port=5959'
].join(' '));

electron.stdout.pipe(process.stdout);
electron.stderr.pipe(process.stderr);
// terminate webpack-dev-server when Electron closed
electron.on('close', code => {
  console.log('\nElectron closed. Exiting...');
  process.exit(code);
});

// renderer webpack config
const compileCfg = require('./webpack.config.renderer');

/** @type {import('webpack-dev-server').Configuration} */
const wdsOpt = {
  // serve '/login/html'
  contentBase: absPath('/src/renderer'),
  publicPath: '/',
  // `hot` must be true when using HMR
  hot: true,
  // https://github.com/webpack/webpack-dev-server/pull/1775
  // fixed by https://github.com/webpack/webpack-dev-server/pull/1935 , but not released yet
  // inject 'webpack/hot/dev-server'
  injectHot: true,
  // inject 'webpack-dev-server/client?http://<host>:<port>'
  injectClient: true,
  stats: 'minimal',
  // `port` must be specified when using `addDevServerEntrypoints`
  // https://github.com/webpack/webpack-dev-server/blob/v3.4.1/lib/utils/addEntries.js#L12-L18
  // https://github.com/webpack/webpack-dev-server/blob/v3.4.1/lib/utils/createDomain.js
  port: config.devPort,
  overlay: true
};

// enable HMR.
// see https://webpack.js.org/guides/hot-module-replacement/#via-the-node-js-api
WebpackDevServer.addDevServerEntrypoints(compileCfg, wdsOpt);

new WebpackDevServer(webpack(compileCfg), wdsOpt).listen(config.devPort);
