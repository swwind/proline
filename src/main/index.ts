
import { BrowserWindow, app } from 'electron';
import log from 'electron-log';

let mainWindow;
const winURL = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

log.log(`open URL: ${winURL}`);

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

  log.log('main window created');
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

require('./backend');
