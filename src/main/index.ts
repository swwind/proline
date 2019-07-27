
import { BrowserWindow, app } from 'electron';

let mainWindow;
const winURL = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

/**
 * create window
 */
function createWindow() {

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'
// autoUpdater.on('update-downloaded', () => {
// autoUpdater.quitAndInstall()
// })
// app.on('ready', () => {
// if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })

import './backend';

// import omelet from './omelet';
// omelet('47.103.116.110:23333');
