
import { BrowserWindow, app, Menu, Tray } from 'electron';
import path from 'path';

// import { IMain } from '../types';
// /* eslint-disable-next-line */
// declare const __non_webpack_require__: Function;
// const main: IMain = __non_webpack_require__('./core').default;
// const { server } = main;


let mainWindow: BrowserWindow | null;
const winURL = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const tray = new Tray(path.resolve(__dirname, 'static', 'icon', 'icon.ico'));
  const menu = Menu.buildFromTemplate([{
    label: 'Quit',
    click() {
      process.exit();
    }
  }, {
    label: 'Open window',
    click() {
      if (mainWindow) {
        mainWindow.show();
      }
    }
  }, {
    label: 'Hide window',
    click() {
      if (mainWindow) {
        mainWindow.hide();
      }
    }
  }]);
  tray.setToolTip('你好');
  tray.setContextMenu(menu);
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

