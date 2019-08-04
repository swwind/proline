'use strict'

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const mainConfig = require('./webpack.main.config')(null, { mode: 'development' })
const rendererConfig = require('./webpack.renderer.config')(null, { mode: 'development' })
const coreConfig = require('./webpack.core.config');

let electronProcess = null
let manualRestart = false
let hotMiddleware

const logStats = (proc, data) => {
  console.log(`[${proc}] ${data.toString({
    colors: true
  })}`);
}

const startRenderer = () => {
  return new Promise((resolve, reject) => {
    rendererConfig.entry.renderer = [path.join(__dirname, 'dev-client')].concat(rendererConfig.entry.renderer)
    rendererConfig.mode = 'development'
    const compiler = webpack(rendererConfig)
    hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2500
    })

    compiler.hooks.done.tap('done', stats => {
      logStats('Renderer', stats)
    })

    const server = new WebpackDevServer(
      compiler,
      {
        contentBase: path.join(__dirname, '../'),
        quiet: true,
        before (app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid(() => {
            resolve()
          })
        },
        hot: false,
        inline: false,
      }
    )

    server.listen(9080)
  })
}

const startBackend = (title, config) => {
  return new Promise((resolve, reject) => {
    config.mode = 'development';
    const compiler = webpack(config);

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      logStats(title, chalk.white.bold('compiling...'))
      hotMiddleware.publish({ action: 'compiling' })
      done()
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      logStats(title, stats)

      if (electronProcess && electronProcess.kill) {
        manualRestart = true;
        electronProcess.kill('SIGINT');

        setTimeout(() => {
          manualRestart = false;
        }, 5000)
      }

      resolve()
    })
  })
}

const startElectron = () => {
  var args = [
    '--inspect=5858',
    path.join(__dirname, '../dist/main.js')
  ];

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3));
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2));
  }

  electronProcess = spawn(electron, args);
  
  electronProcess.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });
  electronProcess.stderr.on('data', (data) => {
    console.error(data.toString().trim());
  });

  electronProcess.on('close', () => {
    if (!manualRestart) {
      process.exit();
    } else {
      startElectron();
    }
  });
}

const init = async () => {

  await Promise.all([
    startRenderer(),
    startBackend('Main', mainConfig),
    startBackend('Core', coreConfig),
  ]);
  startElectron();
}

init();

process.on('SIGINT', () => {
  if (electronProcess && !electronProcess.killed) {
    electronProcess.kill('SIGINT');
  } else {
    process.exit();
  }
});
