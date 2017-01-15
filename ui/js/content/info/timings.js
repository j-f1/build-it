import React from 'react'

export function toTimeString (sec) {
  sec = Math.abs(sec)
  if (sec < 1) {
    return `${Math.round(sec * 1000)}ms`
  } else if (sec < 10) {
    return `${Math.round(sec, 2)} seconds`
  } else if (sec < 60) {
    return `${Math.round(sec, 1)} seconds`
  } else if (sec < (60 * 60)) {
    return `${Math.round(sec / 60)} min ${toTimeString(sec % 60)}`
  }
  return `${Math.round(sec / (60 * 60))} hr ${toTimeString(sec % (60 * 60))}`
}

export default ({ stats }) => <span>
  Compilation took{' '}
  <strong>{toTimeString(stats.time / 1000)}</strong>
</span>
