const { app, Menu, ipcMain, dialog } = require('electron')

const { REACT_DEVELOPER_TOOLS, REACT_PERF, default: installExtension } = require('electron-devtools-installer')

const { expand, shrink } = require('./resizer')
const getMenu = require('./menu')
const { createWindow } = require('./window')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.on('resizer-expand', expand)
  ipcMain.on('resizer-shrink', shrink)
  Promise.all([REACT_DEVELOPER_TOOLS, REACT_PERF].map(installExtension))
      .then((names) => names.map(name => console.log(`Added Extension:  ${name}`)))
      .catch((err) => console.error('An error occurred: ', err))
  require('devtron').install()
  open()
  Menu.setApplicationMenu(getMenu({
    open
  }))
})
function open () {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, ([path]) => {
    createWindow({
      path
    })
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
