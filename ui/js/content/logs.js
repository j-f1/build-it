import moment from 'moment'
import React from 'react'
import ansiStyle from 'react-ansi-style'
import stripANSI from 'strip-ansi'

import FA from 'react-fontawesome'
import { st, Input } from '../util'

export default class Logs extends React.Component {
  constructor (...args) {
    super(...args)
    this._toggleFiltering = this._toggleFiltering.bind(this)
    this._filter = this._filter.bind(this)
    this.state = {
      filtering: false,
      filter: ''
    }
  }
  _toggleFiltering () {
    this.setState(({ filtering }) => ({
      filtering: !filtering
    }))
  }
  _filter (e) {
    this.setState({
      filter: e.target.value
    })
  }
  render () {
    const { logs, hidden, clearLogs } = this.props
    const styles = st({
      default: {
        container: {
          paddingBottom: 0.02,
          background: '#ECECEC',
          overflow: 'auto'
        },
        bar: {
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #CCC',
          marginBottom: -1,
          flexShrink: 0,
          zIndex: 100,
          height: '2.5em',
          padding: '0 4px'
        },
        barItem: {
          cursor: 'pointer',
          margin: '0 4px'
        },
        input: {
          width: 0,
          opacity: 0,
          transition: 'all 0.4s'
        }
      },
      filtering: {
        input: {
          width: 175,
          opacity: 1
        }
      }
    }, this.state)
    let orderedLogs = [...logs].reverse()
    if (this.state.filtering) {
      orderedLogs = orderedLogs.filter(log => stripANSI(log.message).toLowerCase().match(this.state.filter.trim()))
    }
    return <div
      hidden={hidden}
      style={Object.assign({
        display: 'flex',
        flexDirection: 'column'
      }, this.props.style)}>
      <div style={styles.bar}>
        <FA name='trash' style={styles.barItem} fixedWidth onClick={clearLogs} />
        <FA name='filter' style={styles.barItem} fixedWidth onClick={this._toggleFiltering} />
        <Input style={Object.assign({}, styles.barItem, styles.input)} placeholder='Filter…' onChange={this._filter} value={this.state.filter} />
      </div>
      <div style={Object.assign({}, orderedLogs[0] && orderedLogs[0].type === 'separator' && {
        marginTop: '1em'
      }, styles.container)}>
        {orderedLogs.map((log, i) => <Log
          key={(+log.date) + String(log.message)}
          {...st.loop(i, logs.length)}
          {...log}
        />)}
      </div>
    </div>
  }
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
