let EXPANDED_SIZE = {w: 700, h: 500}
let SMALL_SIZE = {w: 500, h: 36}

function expand (w) {
  const bounds = w.getBounds()
  if ((bounds.x + EXPANDED_SIZE.w) > window.screen.width) {
    w.setBounds({
      x: bounds.x + window.screen.width - (bounds.x + EXPANDED_SIZE.w),
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

module.exports = {
  EXPANDED_SIZE,
  SMALL_SIZE,
  expand,
  shrink
}
