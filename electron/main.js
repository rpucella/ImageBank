const { app, BrowserWindow, ipcMain } = require('electron')
const imagebank = require('../core/imagebank')
const path = require('path')
const fs = require('fs')
const child_process = require('child_process')

const _EXPECTED_VERSION = 2
let _PROCESS = null

function message (win, msg) {
  const m = `data:text/html;charset=utf-8,<head><style>div { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; min-height: 95vh; font-size: 24px; }</style></head><body><div>${msg}</div></body>`
  win.loadURL(m)
}

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  try {
    const configFile = path.join(app.getPath('userData'), 'appConfig.json')
    if (!fs.existsSync(configFile)) {
      return message(win, `No config file ${configFile}`)
    }
    const config = JSON.parse(fs.readFileSync(configFile));
    if (!config['ImageBankFolder']) {
      return message(win, `No entry ImageBankFolder in ${configFile}`)
    }
    let folder = config['ImageBankFolder']
    if (!folder.startsWith('/')) {
      folder = path.join(process.cwd(), folder)
    }
    if (!fs.existsSync(folder)) {
      return message(win, `Cannot find folder ${folder}`)
    }
    if (!fs.existsSync(path.join(folder, 'images.db'))) {
      return message(win, `Cannot find images database in ${folder}`)
    }
    const version = await imagebank.version(folder)
    if (version !== _EXPECTED_VERSION) {
      return message(win, `Wrong DB version - expected ${_EXPECTED_VERSION} but found ${version}`)
    }
    message(win, 'Loading...')
    // cf - https://github.com/electron/electron/issues/2708
    // first look at the root of the project (remember, this file is in electron/)
    let cwd = path.join(__dirname, '..')    
    let cp_path
    let cp_root
    // check if the root of the project is under app.asar
    // (if so, we're running in a packaged Electron app)
    if (fs.existsSync(path.join(cwd, '..', 'app.asar'))) {
      cwd = path.join(cwd, '..')
      cp_path = 'app.asar/electron/server.js'
      cp_root = 'app.asar'
    }
    else {
      cp_path = 'electron/server.js';
      cp_root = '.'
    }
    _PROCESS = child_process.fork(cp_path, [folder, cp_root], { cwd: cwd })
    
    _PROCESS.on('message', function() { 
      // load the index.html of the app.
      win.loadURL('http://localhost:8501')
    })
  } catch(err) {
    return message(win, `Error: ${err}`)
  }
}

app.whenReady().then(createWindow)

app.on('quit', function() {
  if (_PROCESS) {
    _PROCESS.kill()
    console.log('Killing server process')
  }
})
