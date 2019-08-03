// 管理 omelet

import { spawn, ChildProcess } from 'child_process';
import { createConnection, Socket } from 'net';
import log from 'electron-log';
import path from 'path';
import * as R from 'ramda';
import * as Peers from './peers/Peers';

let child: ChildProcess;
let exit = false;

const localport = 21183;

const spawnLinux = (server: string) => {
  const filepath = path.resolve(__dirname, '..', 'bin', 'client_linux');

  log.log(filepath);

  return spawn('pkexec', [
    filepath,
    '-s',
    server,
  ], {
    stdio: ['inherit', 'inherit', 'inherit']
  });
};

const spawnWindows = (server: string) => {
  const filepath = path.resolve(__dirname, '..', 'bin', 'client_windows.exe');

  return spawn(filepath, [
    '-s', server
  ]);
};

const spawnClient = (server: string) => {

  const platform = process.platform;
  if (platform === 'linux') {
    child = spawnLinux(server);
  } else if (platform === 'win32') {
    child = spawnWindows(server);
  } else {
    return log.error(`[OMELET] platform not supported: ${platform}`);
  }

  if (!child) {
    return log.error('[OMELET] client file not found');
  }

  child.on('close', (code, signal) => {
    // 不是正常退出，重新创建进程
    if (!exit) {
      setTimeout(() => {
        spawnClient(server);
      }, 1000);
      log.error(`[OMELET] Omelet exit with code=${code} signal=${signal}`);
    } else {
      process.exit();
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
  log.log('[OMELET] check process for exit...');
  if (child && !child.killed) {
    child.kill('SIGINT');
    log.log('[OMELET] exited...');
  } else {
    process.exit();
  }
};

process.on('SIGINT', (code) => {
  log.log(`exit code: ${code}`);
  exitClient();
});

let socket: Socket;
let localip: string;

const buffer2ipv6 = (str: Buffer | number[]) => {
  return R.splitEvery(2, Array.from(str))
    .map((a) => Buffer.from(a).toString('hex'))
    .join(':');
};

const createClient = (server: string) => {

  spawnClient(server);

  setInterval(() => {
    if (socket && socket.readable) {
      // alive
      return;
    }
    // otherwise create a new process
    socket = createConnection({ port: localport }, () => {
      socket.write(Buffer.from('d3090400', 'hex'));
    });
    socket.on('data', (data) => {
      const header = data.slice(0, 2).toString('hex');
      const length = (data[3] << 4) | data[2];
      switch (header) {
        case 'd409': {
          // 发送本地端口
          localip = buffer2ipv6(data.slice(4, 20));
          log.log(`[OMELET] localip: ${localip}`);
          setTimeout(() => {
            socket.write(Buffer.from('d3080400', 'hex'));
          }, 500);
          break;
        }
        case 'd408': {
          // 发送虚拟地址
          const list = data.slice(4, length);
          if (list.length % 16 > 0) {
            return log.error('[OMELET] Recieved broken packet');
          }
          const ips = R.splitEvery(16, Array.from(list)).map(buffer2ipv6);
          const ipset = new Set<string>(ips);
          ipset.delete(localip);
          Peers.updatePeers('SERVER', Array.from(ipset));
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
