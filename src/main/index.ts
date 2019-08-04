/* eslint-disable */

import { BrowserWindow, app, Menu, Tray, ipcMain, shell } from 'electron';
import path from 'path';
import { log } from 'electron-log';

import { IMain } from '../types';
/* eslint-disable-next-line */
declare const __non_webpack_require__: Function;
const main: IMain = __non_webpack_require__('./core').default;

let mainWindow: BrowserWindow | null;
let tray: Tray | null;
let exit = false;
const winURL = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

const doExit = () => {
  exit = true;
  if (mainWindow) {
    mainWindow.close();
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
      log('[MAIN] Window closed, but I don\'t want to be killed');
      e.preventDefault();
      if (mainWindow) {
        mainWindow.hide();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menu = Menu.buildFromTemplate([{
    label: 'File',
    submenu: [{
      label: 'Quit',
      accelerator: 'Ctrl+Q',
    }],
  }, {
    label: 'Help',
    submenu: [{
      label: 'About...',
      click() {
        shell.openExternal('https://github.com/swwind/proline');
      }
    }],
  }]);
  // mainWindow.setMenu(menu);

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
