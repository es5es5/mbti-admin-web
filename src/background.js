'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
function createUpdateWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}

autoUpdater.on('checking-for-update', () => log.info('업데이트 확인 중...'))
autoUpdater.on('update-available', info => {
  log.info('업데이트가 가능합니다.')
  log.log(info)
})
autoUpdater.on('update-not-available', () => log.info('현재 최신버전입니다.'))
autoUpdater.on('error', err => log.info('에러가 발생하였습니다. 에러내용 : ' + err))

autoUpdater.on('download-progress', progressObj => {
  let log_message = "다운로드 속도: " + progressObj.bytesPerSecond
  log_message = log_message + ' - 현재 ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  log.info(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
  createUpdateWindow()
  sendStatusToWindow("Update downloaded");

  const option = {
    type: "question",
    buttons: ["업데이트", "취소"],
    defaultId: 0,
    title: "electron-updater",
    message: "업데이트가 있습니다. 프로그램을 업데이트 하시겠습니까?",
  };
  let btnIndex = dialog.showMessageBoxSync(updateWin, option);

  if(btnIndex === 0) {
    autoUpdater.quitAndInstall();
  }
  log.info('업데이트가 완료되었습니다.')
})

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    autoUpdater.checkForUpdatesAndNotify()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
