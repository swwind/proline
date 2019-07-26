// 管理 omelet

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { createConnection, Socket } from 'net';
import log from 'electron-log';
import path from 'path';

let child: ChildProcessWithoutNullStreams;
let exit = false;

const localport = 21183;

const spawnClient = (server: string) => {
  child = spawn(path.resolve(__dirname, './static/client_linux'), [
    '-s', server,
    '-b', `0.0.0.0:${localport}`,
  ]);
  child.on('exit', (code, signal) => {
    // 不是正常退出，重新创建进程
    if (!exit) {
      setTimeout(() => {
        spawnClient(server);
      }, 1000);
    }
    log.log(`Child exit with code=${code} signal=${signal}`);
  });
  child.stdout.on('data', (data) => {
    log.log(data.toString());
  });
  child.stderr.on('data', (data) => {
    log.error(data.toString());
  });
};

const exitClient = () => {
  exit = true;
  if (child) {
    child.kill('SIGINT');
  }
};

process.on('exit', () => {
  exitClient();
});

let socket: Socket;

const createClient = (server: string) => {

  spawnClient(server);

  setInterval(() => {
    if (socket && socket.readable) {
      // alive
      return;
    }
    socket = createConnection({ port: localport }, () => {
      socket.write(Buffer.from([0xd3, 0x89, 0x00, 0x04]));
    });
    socket.on('data', (data) => {
      log.log('Recieved data');
      log.log(data);
    });
    socket.on('error', (e) => {
      log.error('Client Connection Error');
      log.error(e);
    });
    socket.on('end', () => {
      log.log('Socket ended');
    });
    log.log(`Socket started for port: ${localport}`);
  }, 5000);

};

export default createClient;
