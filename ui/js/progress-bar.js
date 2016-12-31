import React from 'react'
import { cx } from './util'

export default function ProgressBar ({ progress, percent = 0, visible = true }) {
  return <span className={cx('progress', {'hidden': !visible})}>
    <span className={cx('bar', {'hidden': !visible})} style={{
      width: `${percent || (progress * 100)}%`
    }} />
  </span>
}
