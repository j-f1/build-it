import React from 'react'

import { m, st, vars } from './util'

export default function ProgressBar ({
  progress, percent = 0,
  visible = true,
  style, trackStyle,
  fat = false
}) {
  const styles = st({
    default: {
      bar: {
        display: 'block',
        background: vars.accent,
        transition: [
          `width ${vars.duration} ${vars.easeOutSmooth}`,
          `opacity ${vars.duration}`
        ].join(','),
        width: `${percent || (progress * 100)}%`
      }
    }, // default
    hidden: {
      bar: {
        opacity: 0
      }
    }, // hidden
    fat: {
      container: {
        background: '#E8EDF1',
        display: 'block',
        height: 7,
        borderRadius: 3.5,
        marginRight: '0.5em',
        overflow: 'hidden'
      },
      bar: {
        display: 'block',
        height: '100%'
      }
    } // fat
  }, {
    hidden: !visible,
    fat
  })
  return <span style={m(styles.container, trackStyle)}>
    <span style={m(styles.bar, style)} />
  </span>
}
