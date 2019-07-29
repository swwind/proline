// 管理 omelet

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { createConnection, Socket } from 'net';
import log from 'electron-log';
import path from 'path';
import * as R from 'ramda';
import Peers from './core/peers/Peers';

let child: ChildProcessWithoutNullStreams;
let exit = false;

const localport = 21183;

const spawnClient = (server: string) => {

  const filepath = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, './static/client_linux')
    : path.resolve(__dirname, '../static/client_linux');

  child = spawn(filepath, [
    '-s', server,
    '-b', `0.0.0.0:${localport}`,
  ]);

  if (!child) {
    return log.error('[OMELET] client file not found');
  }

  child.on('exit', (code, signal) => {
    // 不是正常退出，重新创建进程
    if (!exit) {
      setTimeout(() => {
        spawnClient(server);
      }, 1000);
      log.error(`[OMELET] Child exit with code=${code} signal=${signal}`);
    }
  });

  // child.stdout.on('data', (data) => {
  // log.log(data.toString().trim());
  // });
  // child.stderr.on('data', (data) => {
  // log.error(data.toString().trim());
  // });
};

const exitClient = () => {
  exit = true;
  if (child && !child.killed) {
    child.kill('SIGINT');
  }
};

process.on('exit', () => {
  exitClient();
});

let socket: Socket;
let localip: string;

const createClient = (server: string) => {

  spawnClient(server);

  setInterval(() => {
    if (socket && socket.readable) {
      // alive
      return;
    }
    socket = createConnection({ port: localport }, () => {
      socket.write(Buffer.from('d3890400', 'hex'));
    });
    socket.on('data', (data) => {
      const header = data.slice(0, 2).toString('hex');
      const length = (data[3] << 4) | data[2];
      switch (header) {
        case 'd349': {
          // 发送本地端口
          localip = data.slice(4, 8).join('.');
          setTimeout(() => {
            socket.write(Buffer.from('d3880400', 'hex'));
          }, 500);
          break;
        }
        case 'd348': {
          // 发送虚拟地址
          const list = data.slice(4, length);
          if (list.length % 4 > 0) {
            return log.error('[OMELET] Recieved broken packet');
          }
          const ips = R.splitEvery(8, list.toString('hex')).map((v) => {
            return Buffer.from(v, 'hex').join('.');
          });
          const ipset = new Set(ips);
          ipset.delete(localip);
          Peers.updatePeers('SERVER', ipset);
          setTimeout(() => {
            socket.write(Buffer.from('d3880400', 'hex'));
          }, 15000);
          break;
        }
        default: {
          log.error('[OMELET] Recieved an unknown packet');
          log.error(data);
        }
      }
    });
    socket.on('error', (e) => {
      log.error('[OMELET] Socket Error');
      log.error(e);
    });
    socket.on('end', () => {
      log.log('[OMELET] Socket ended');
    });
    log.log(`[OMELET] Socket started with port: ${localport}`);
  }, 5000);

};

export default createClient;
