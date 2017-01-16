const { BrowserWindow } = require('electron')
const querystring = require('querystring')
const path = require('path')

const { SMALL_SIZE } = require('./resizer')

const wins = new Set()

exports = module.exports = {
  createWindow (winArgs = {path: path.dirname(__dirname)}, arg = {}) {
    const { hidden = false } = arg
    const w = new BrowserWindow({
      width: SMALL_SIZE.w,
      height: SMALL_SIZE.h,
      titleBarStyle: 'hidden-inset',
      alwaysOnTop: true,
      resizable: false,
      fullscreenable: false,
      maximizable: false,
      minWidth: SMALL_SIZE.w,
      minHeight: SMALL_SIZE.h,
      show: !hidden
    })

    w.loadURL(`file://${__dirname}/../ui/index.html?${querystring.stringify(winArgs)}`)
    w.webContents.openDevTools()

    if (hidden) {
      w.once('ready-to-show', () => w.show())
    }

    wins.add(w)
    w.on('closed', function () {
      wins.delete(w)
    })
    return w
  }
}
