import debounce from 'debounce'
import React from 'react'

import { st } from '../../util'

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
    this.state = {
      custom: false
    }
  }
  _toggleProd (isProd) {
    this.props.setEnv(isProd ? 'production' : 'dev')
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
    this.props.setEnv(env)
  }
  render () {
    const styles = st({
      default: {
        container: {
          paddingTop: 0,
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center'
        },
        section: {
          margin: 'auto'
        }
      }
    })
    const isProd = this.props.env.startsWith('prod')
    return <form style={Object.assign({}, this.props.style, styles.container, this.props.hidden && { display: 'none' })}><section style={styles.section}>
      <h1 style={{marginTop: 0}}>Environment <a href='#' onClick={this._toggleCustom} style={{
        fontWeight: 'normal',
        fontSize: '1rem',
        display: 'inline-block',
        verticalAlign: 'middle',
        width: 60
      }}>{this.state.custom ? 'Default' : 'Custom'}</a></h1>
      {this.state.custom
        ? <Input
          style={{
            height: 50,
            width: 275,
            fontFamily: 'Fira Code, Fira Mono, Menlo, Courier New, monospace'
          }}
          el='textarea'
          defaultValue={this.props.env}
          onChange={this._setEnv}
        /> : <Toggle
          style={{
            width: 275
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
    </section></form>
  }
}

const Input = st.handleFocus(_Input)
function _Input (props) {
  const { el: Element = 'input', style, containerStyle, focused, blurred, ...rest } = props
  const styles = st({
    default: {
      container: {
        display: 'inline-flex',
        borderRadius: 2,
        transition: 'box-shadow .25s cubic-bezier(0.165, 0.840, 0.440, 1)' // easeOutQuart
      },
      input: {
        border: '1px solid',
        borderColor: '#BFBFBF',
        transition: 'border .25s cubic-bezier(0.165, 0.840, 0.440, 1)', // easeOutQuart
        background: 'transparent'
      }
    },
    focused: {
      container: {
        boxShadow: '0 0 0 3px hsla(211, 96%, 48%, 0.4)'
      },
      input: {
        borderColor: '#B4CAE2',
        outline: 'none'
      }
    }
  }, { focused, blurred })
  return <span style={Object.assign({}, styles.container, containerStyle)}><Element {...rest} style={Object.assign({}, styles.input, style)} /></span>
}
