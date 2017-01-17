import FA from 'react-fontawesome'
import React from 'react'

import { st } from '../../util'

export default function Toggle (props) {
  const { leftIcon, leftTitle, rightIcon, rightTitle, style, value = false, onChange = () => {} } = props
  const styles = st({
    default: {
      switch: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '2em',
        cursor: 'pointer'
      },
      track: {
        border: '1px solid #ccc',
        display: 'inline-block',
        width: '4em',
        height: '1em',
        margin: '0 1em',
        borderRadius: '0.25em',
        overflow: 'hidden',
        position: 'relative',
        textAlign: 'right',
        pointerEvents: 'none'
      },
      thumb: {
        appearance: 'none',
        border: 'none',
        background: '#999',
        display: 'block',
        height: 'calc(100% + 2px)',
        width: '1.75em',
        borderRadius: '0.25em',
        margin: -1,
        fontSize: 'inherit',
        transition: 'transform 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)'
      },

      icon: {
        transition: 'opacity 0.4s cubic-bezier(0.215, 0.61, 0.355, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      title: {
        fontSize: '0.5em'
      },
      left: {
        order: -1,
        opacity: 1
      },
      right: {
        opacity: 0.5
      }
    },
    value: {
      thumb: {
        transform: 'translateX(calc(4em - 1.75em + 2px))'
      },
      left: {
        opacity: 0.5
      },
      right: {
        opacity: 1
      }
    }
  }, props)
  return <span style={Object.assign({}, styles.switch, style)} onClick={e => onChange(!value, e)}>
    <span style={styles.track}>
      <span style={styles.thumb} />
    </span>
    <span className={Object.assign({}, styles.icon, styles.left)}>
      <FA name={leftIcon} fixedWidth />
      <span style={styles.title}>{leftTitle}</span>
    </span>
    <span className={Object.assign({}, styles.icon, styles.right)}>
      <FA name={rightIcon} fixedWidth />
      <span style={styles.title}>{rightTitle}</span>
    </span>
  </span>
}
