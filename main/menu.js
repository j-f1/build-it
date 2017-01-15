const { app, Menu } = require('electron')

const em = require('electron-menu')

function n (role) {
  return {role}
}

exports = module.exports = ({
  open
}) => {
  const tmpl = [
    [
      'File',
      [
        ['Open', 'CmdOrCtrl+O', open]
      ]
    ],
    [
      'Edit',
      [
        n('undo'), n('redo'),
        '-',
        n('cut'), n('copy'), n('paste'),
        n('pasteandmatchstyle'),
        n('delete'), n('selectall')
      ]
    ],
    [
      'View',
      [
        n('toggledevtools'),
        n('togglefullscreen')
      ]
    ],
    {
      role: 'window',
      submenu: em([
        n('minimize'), n('close')
      ])
    },
    {
      role: 'help',
      submenu: []
    }
  ]

  if (process.platform === 'darwin') {
    tmpl.unshift([
      app.getName(),
      [
        n('about'),
        '-',
        n('services'),
        '-',
        n('hide'), n('hideothers'), n('unhide'),
        '-',
        n('quit')
      ]
    ])
    // Edit menu.
    tmpl[2][1].push(
      '-',
      [
        'Speech',
        [
          n('startspeaking'),
          n('stopspeaking')
        ]
      ]
    )
    // Window menu.
    tmpl[4].submenu = em([
      n('close'), n('minimize'), n('zoom'),
      '-',
      n('front')
    ])
  }
  return Menu.buildFromTemplate(em(tmpl))
}
