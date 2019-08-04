// 管理 omelet

import { promises as fs, constants } from 'fs';
import { spawn, ChildProcess, exec } from 'child_process';
import { createConnection, Socket } from 'net';
import log from 'electron-log';
import path from 'path';
import * as R from 'ramda';
import * as Peers from './peers/Peers';

let child: ChildProcess;
let exit = false;

const localport = 21183;

const execPromise = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
};

const spawnLinux = async (server: string) => {
  const sudofile = path.resolve(__dirname, '..', 'bin', 'sudo_client_linux');
  const filepath = path.resolve(__dirname, '..', 'bin', 'client_linux');

  try {
    await fs.access(sudofile, constants.F_OK && constants.X_OK);
    const stat = await fs.stat(sudofile);
    const fstat = await fs.stat(filepath);
    if (stat.uid !== 0 || stat.gid !== 0 || stat.mode !== 35145) {
      throw new Error('SUDO file not privileged');
    }
    if (fstat.size !== stat.size) {
      throw new Error('Omelet version is not current');
    }
  } catch (e1) {
    log.warn('[OMELET] privileged client_linux not found, trying to create a new');
    try {
      // try to remove broken one
      try {
        await fs.unlink(sudofile);
      } catch (e2) {
        // do nothing
      }
      await fs.copyFile(filepath, sudofile);
      await execPromise(`pkexec /bin/bash -c "chown root:root '${sudofile}'; chmod 4511 '${sudofile}'"`);
    } catch (e3) {
      log.error('[OMELET] failed to create privileged client_linux');
      log.error(e3);
    }
  }

  return spawn(sudofile, [
    '-s', server,
  ], {
    stdio: ['inherit', 'inherit', 'inherit']
  });
};

const spawnWindows = async (server: string) => {
  log.log(server);
  throw new Error('Windows version is not available.');
};

const spawnClient = async (server: string) => {

  const platform = process.platform;
  if (platform === 'linux') {
    child = await spawnLinux(server);
  } else if (platform === 'win32') {
    child = await spawnWindows(server);
  } else {
    return log.error(`[OMELET] platform not supported: ${platform}`);
  }

  child.on('close', (code, signal) => {
    // 不是正常退出，重新创建进程
    if (!exit) {
      setTimeout(spawnClient, 1000, server);
      log.error(`[OMELET] Omelet exited with code=${code} signal=${signal}`);
    } else {
      log.log('[OMELET] Omelet exited successfully');
      process.exit();
    }
  });
};

const exitClient = () => {
  exit = true;
  if (child && !child.killed) {
    child.kill('SIGINT');
    log.log('[OMELET] Sent SIGINT to child, waiting for exit');
  } else {
    log.log('[OMELET] Omelet is not running, exit directly');
    process.exit();
  }
};

process.on('SIGINT', (code) => {
  log.log(`recieved exit code: ${code}`);
  exitClient();
});
process.on('exit', (code) => {
  log.error(`Recieved unknown code: ${code}`);
  exitClient();
});

let socket: Socket;
let localip: string;

const buffer2ipv6 = (str: Buffer | number[]) => {
  return R.splitEvery(2, Array.from(str))
    .map((a) => Buffer.from(a).toString('hex'))
    .join(':');
};

const listenSocket = () => {
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
          socket.write(Buffer.from('d3080400', 'hex'));
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
};

const createClient = async (server: string) => {

  await spawnClient(server);

  setInterval(listenSocket, 5000);

};

export default createClient;
