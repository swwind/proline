const { app, BrowserWindow } = require('electron');

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadURL(process.env.MAIN_URL);
}

app.whenReady().then(createWindow)
