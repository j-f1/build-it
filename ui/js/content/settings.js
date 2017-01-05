import React from 'react'
import { st } from '../util'

export default class Settings extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      env: ''
    }
  }
  _update (key) {
    return ({ target: { value } }) => this.setState({ [key]: value })
  }
  render () {
    const styles = st({
      default: {
        container: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }
      }
    })
    return <form style={styles.container}>
      <h1>webpack</h1>
      <p><label>Environment: <Input value={this.state.env} onChange={this._update('env')} /></label></p>
    </form>
  }
}

const Input = st.handleFocus(_Input)
function _Input (props) {
  const { style, inputStyle, focused, blurred, ...rest } = props
  const styles = st({
    default: {
      container: {
        display: 'inline-flex',
        borderRadius: 2,
        transition: 'box-shadow .25s cubic-bezier(0.165, 0.840, 0.440, 1)' /* easeOutQuart */
      },
      input: {
        border: '1px solid',
        borderColor: '#BFBFBF',
        transition: 'border .25s cubic-bezier(0.165, 0.840, 0.440, 1)', /* easeOutQuart */
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
  return <span style={Object.assign({}, styles.container, style)}><input {...rest} style={Object.assign({}, styles.input, inputStyle)} /></span>
}
