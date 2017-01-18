import React from 'react'

import { st } from '../../util'

import Timings from './timings'
import Modules from './modules'
import Assets from './assets'
import Hash from './hash'

export default function Info (props) {
  const { stats, shortHashLength } = props
  const styles = st({
    default: {
      container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0
      }
    }
  }, props)
  if (!stats) {
    return <article style={Object.assign({
      textAlign: 'center'
    }, props.style, styles.container)} hidden={props.hidden}>
      <h3>Compiling…</h3>
      <small>Info will appear when finished</small>
    </article>
  }
  return <article style={Object.assign({}, props.style, styles.container)} hidden={props.hidden}>
    <div style={{
      overflow: 'auto',
      padding: '0 1em'
    }}>
      <p><Timings stats={stats} /></p>
      <p><Hash stats={stats} shortHashLength={shortHashLength} /></p>
      <h3>Assets</h3>
      <Assets stats={stats} />
      <details style={{
        marginBottom: 1 // fix scroll
      }}>
        <summary><h3 style={{
          display: 'inline-block'
        }}>Modules</h3></summary>
        <Modules stats={stats} />
      </details>
    </div>
  </article>
}
