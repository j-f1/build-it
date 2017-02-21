import moment from 'moment'
import React from 'react'
import ansiStyle from 'react-ansi-style'

import { st } from '../util'

export default function Logs (props) {
  const { logs, hidden } = props
  const styles = st({
    default: {
      container: {
        paddingBottom: 0.02,
        background: '#ECECEC'
      }
    }
  })
  return <div hidden={hidden} style={Object.assign({}, props.style)}>
    <div style={styles.container}>
      {[...logs].reverse().map((log, i) => <Log
        key={(+log.date) + String(log.message)}
        {...st.loop(i, logs.length)}
        {...log}
      />)}
    </div>
  </div>
}

function Log (props) {
  const { type, message, date } = props
  const niceDate = moment(date).fromNow()
  if (type === 'separator') {
    return <Separator {...props} />
  }
  const styles = st({
    default: {
      container: {
        padding: '1em',
        margin: '1px 0',
        display: 'flex',
        alignItems: 'center',
        background: 'white'
      },
      date: {
        float: 'right',
        opacity: 0.5,
        textTransform: 'uppercase',
        fontSize: '0.75em'
      },
      message: {
        flex: 1
      }
    },
    'type-error': {
      container: {
        background: '#FFFBBD',
        color: '#4E2C00',
        border: '1px solid #FFF5AE',
        margin: '0 -1px'
      }
    }
  }, props)
  return <p style={styles.container}><span style={styles.message}>{message ? ansiStyle(React, message) : <em>No message</em>}</span><span style={styles.date}>{niceDate}</span></p>
}

function Separator ({ message, date, ...props }) {
  const styles = st({
    default: {
      container: {
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '1px 0',
        margin: '-1px 0'
      },
      label: {
        color: 'rgba(0, 0, 0, 0.5)',
        background: 'white',
        padding: '0 1em',
        fontSize: '0.75em'
      },
      background: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: 'calc(50% - 0.5px)',
        zIndex: -1,
        background: 'white'
      }
    },
    'first-child': {
      container: {
        padding: 'calc(1em + 1px) 0',
        margin: '-1px 0 calc(-1em - 1px)'
      }
    }
  }, props)
  return <div style={styles.container}>
    <span style={styles.label}>{message && ansiStyle(React, message)}{message && ' — '}{moment(date).calendar()}</span>
    <span style={Object.assign({
      top: 0
    }, styles.background)} />
    <span style={Object.assign({
      bottom: 0
    }, styles.background)} />
  </div>
}
