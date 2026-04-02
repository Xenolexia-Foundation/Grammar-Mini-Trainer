const { app, BrowserWindow } = require('node:electron')
const path = require('node:path')

;(function warnIfElectronOutsideSupportedBand() {
  const raw = process.versions.electron
  if (raw == null || raw === '') return
  const major = parseInt(String(raw).split('.')[0] ?? '', 10)
  if (!Number.isFinite(major) || (major >= 39 && major <= 41)) return
  console.warn(
    `[Grammar Mini-Trainer] Electron major ${major} is outside the supported band (39–41).`,
  )
})()

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
