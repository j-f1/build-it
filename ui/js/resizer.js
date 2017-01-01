export let EXPANDED_SIZE = {w: 700, h: 500}
export let SMALL_SIZE = {w: 400, h: 36}

export function expand (w) {
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

export function shrink (w) {
  w.setSize(SMALL_SIZE.w, SMALL_SIZE.h, true)
  w.setResizable(false)
}
