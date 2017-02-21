import debounce from 'debounce'
import React from 'react'

import { st, cancel, Input } from '../../util'

import Toggle from './toggle'

export default class Settings extends React.Component {
  constructor (...args) {
    super(...args)
    this._toggleCustom = this._toggleCustom.bind(this)
    this._toggleProd = this._toggleProd.bind(this)
    const setEnv = debounce(this._setEnv.bind(this), 1000)
    this._setEnv = e => {
      setEnv(e.target.value)
    }
    this._setShortHashLength = this._setShortHashLength.bind(this)
    this.state = {
      custom: false
    }
  }
  _toggleProd (isProd) {
    this.props.settings.commit({
      env: isProd ? 'production' : 'dev'
    })
  }
  _toggleCustom (e) {
    e.preventDefault()
    this.setState(({ custom }) => ({
      custom: !custom
    }))
  }
  _setEnv (env) {
    try {
      env = JSON.parse(env)
    } catch (e) {
      // invalid JSON; leave as a string
    }
    this.props.settings.commit({
      env
    })
  }
  _setShortHashLength (e) {
    this.props.settings.commit({
      shortHashLength: e.target.value
    })
  }
  render () {
    const styles = st({
      default: {
        container: {
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center'
        },
        wrap: {
          margin: 'auto'
        },
        section: {
          WebkitMarginBefore: '1em',
          WebkitMarginAfter: '1em'
        }
      }
    })
    const isProd = this.props.settings.env.startsWith('prod')
    return <form style={Object.assign({}, this.props.style, styles.container)} hidden={this.props.hidden} onSubmit={cancel}><section style={styles.wrap}>
      <section style={Object.assign({
        paddingBottom: '1.1em'
      }, styles.section)}>
        <h1 style={{marginTop: 0}}>Environment <a href='#' onClick={this._toggleCustom} style={{
          fontWeight: 'normal',
          fontSize: '1rem',
          display: 'inline-block',
          verticalAlign: 'middle',
          width: 60
        }}>{this.state.custom ? 'Default' : 'Custom'}</a></h1>
        {this.state.custom
          ? <Input
            inputStyle={{
              height: 50,
              width: 275,
              fontFamily: 'Fira Code, Fira Mono, Menlo, Courier New, monospace'
            }}
            el='textarea'
            defaultValue={this.props.settings.env}
            onChange={this._setEnv}
          /> : <Toggle
            style={{
              width: 275,
              margin: 'auto'
            }}
            leftIcon='code-fork'
            leftTitle='Dev'
            rightIcon='rocket'
            rightTitle='Prod'
            value={isProd}
            onChange={this._toggleProd}
          />
        }
        <small style={{
          opacity: 0.5,
          display: 'block',
          transform: 'translateY(' + (this.state.custom ? 0.25 : -0.5) + 'em)',
          position: 'absolute',
          left: 0,
          width: '100%'
        }}>Changing restarts webpack</small>
      </section>
      <section style={styles.section}>
        <label>Number of characters in short hash: <Input type='number' value={this.props.settings.shortHashLength} onChange={this._setShortHashLength} inputStyle={{width: '4ch'}} /></label>
      </section>
    </section></form>
  }
}
