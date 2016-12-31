import React from 'react'
import { classJoin as cx } from 'css-classname'

export default function ProgressBar ({ progress, percent = 0, visible = true }) {
  return <span className={cx('progress', {'hidden': !visible})}>
    <span className={cx('bar', {'hidden': !visible})} style={{
      width: `${percent || (progress * 100)}%`
    }} />
  </span>
}
