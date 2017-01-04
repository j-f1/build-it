const { BrowserWindow } = require('electron')
let EXPANDED_SIZE = {w: 700, h: 500}
let SMALL_SIZE = {w: 500, h: 36}

function expand (w) {
  const { screen } = require('electron')
  const bounds = w.getBounds()
  const scr = screen.getDisplayMatching(bounds)
  if ((bounds.x + EXPANDED_SIZE.w) > scr.size.width) {
    w.setBounds({
      x: bounds.x + scr.size.width - (bounds.x + EXPANDED_SIZE.w),
      y: bounds.y,
      width: EXPANDED_SIZE.w,
      height: EXPANDED_SIZE.h
    }, true)
  } else {
    w.setSize(EXPANDED_SIZE.w, EXPANDED_SIZE.h, true)
  }
  w.setResizable(true)
}

function shrink (w) {
  w.setSize(SMALL_SIZE.w, SMALL_SIZE.h, true)
  w.setResizable(false)
}

function handleTypes (f) {
  return (w, ...args) => {
    if (w.constructor.name === 'WebContents') {
      return f(BrowserWindow.fromWebContents(w), ...args)
    } else if (w instanceof BrowserWindow) {
      return f(w, ...args)
    } else if (w.sender) {
      return handleTypes(f)(w.sender, ...args)
    } else {
      throw new TypeError(`window-like ${w} isn’t.`)
    }
  }
}

module.exports = {
  EXPANDED_SIZE,
  SMALL_SIZE,
  expand: handleTypes(expand),
  shrink: handleTypes(shrink)
}
