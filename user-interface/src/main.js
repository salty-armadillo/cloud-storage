const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

// Initial store state
store.set("loggedIn", false);
store.set("userId", "");
store.set("token", "");
store.set("keyId", "");

ipcMain.on("login", (_, payload) => {
  store.set("loggedIn", true);
  store.set("userId", payload.userId);
  store.set("token", payload.token);
  store.set("keyId", payload.keyId);
})

ipcMain.on("logout", () => {
  store.set("loggedIn", false);
  store.set("userId", "");
  store.set("token", "");
  store.set("keyId", "");
})

ipcMain.on("getDetails", (e) => {
  e.returnValue = {
    loggedIn: store.get("loggedIn"),
    userId: store.get("userId"),
    token: store.get("token"),
    keyId: store.get("keyId")
  }
})

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

// Start up the Flask executable
let flaskEXE = path.join(__dirname, 'server.exe');
let flaskProcess = require('child_process').execFile(flaskEXE, [8081], { detached: true })

if (flaskProcess != null) {
  console.log("flask started! PID: ", flaskProcess.pid);
} else {
  console.log("uh oh");
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', (e) => {
  e.preventDefault();

  const https = require('https')
  const options = {
    hostname: '127.0.0.1',
    port: 8081,
    path: '/shutdown',
    method: 'GET',
    rejectUnauthorized: false
  }

  const req = https.request(options, res => {
    console.log(`Flask server shutdown statusCode: ${res.statusCode}`)

    res.on('data', (d) => {
      process.stdout.write(d);
    })

    app.exit();
  })

  req.on('error', error => {
    console.error(error)
  })

  req.end()

})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
