const { app, BrowserWindow } = require('node:electron')
const path = require('node:path')

const isDev = process.env.ELECTRON_DEV === '1'

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 640,
    minWidth: 360,
    minHeight: 480,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Grammar Mini-Trainer',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
