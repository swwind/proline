
import { BrowserWindow, app, Menu, Tray, ipcMain, shell } from 'electron';
import path from 'path';
import { log } from 'electron-log';

/* eslint-disable-next-line */
declare const __non_webpack_require__: Function;
__non_webpack_require__('./core');

let mainWindow: BrowserWindow | null;
let tray: Tray | null;
let exit = false;
const winURL = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

const doExit = async () => {
  exit = true;
  if (mainWindow) {
    mainWindow.webContents.send('exit');
  }
};

const toggleMainWindow = () => {
  if (mainWindow) {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  }
};

const createWindow = () => {

  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('close', (e) => {
    if (!exit) {
      log('[MAIN] Window not closed');
      e.preventDefault();
      if (mainWindow) {
        mainWindow.hide();
      }
    }
  });

  mainWindow.on('closed', () => {
    log('[MAIN] Window really closed');
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate([{
    label: 'File',
    submenu: [{
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      click: doExit,
    }],
  }, {
    label: 'Help',
    submenu: [{
      label: 'About...',
      click() {
        shell.openExternal('https://github.com/swwind/proline');
      }
    }, {
      label: 'Open Devtools',
      accelerator: 'Ctrl+Shift+I',
      click() {
        if (mainWindow) {
          mainWindow.webContents.openDevTools();
        }
      }
    }],
  }]);
  mainWindow.setMenu(menu);

  tray = new Tray(path.resolve(
    __dirname,
    'static',
    'icon',
    process.platform === 'win32'
      ? 'icon.ico'
      : 'icon.jpg'
  ));
  const trayMenu = Menu.buildFromTemplate([{
    label: 'Quit',
    click: doExit,
  }, {
    label: 'Toggle window',
    click: toggleMainWindow,
  }]);
  tray.on('click', toggleMainWindow);
  tray.setToolTip('Hello world');
  tray.setContextMenu(trayMenu);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('exit', doExit);
ipcMain.on('finish-exit', () => {
  if (mainWindow) {
    mainWindow.close();
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', doExit);
