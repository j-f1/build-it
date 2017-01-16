import React from 'react'
import { st } from '../../util'

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
    return <form style={Object.assign({}, this.props.style, styles.container, this.props.hidden && { display: 'none' })}><section style={styles.section}>
      <h1 style={{marginTop: 0}}>webpack</h1>
      <p style={{marginBottom: 0}}><label>Environment: <Input el='textarea' value={this.state.env} onChange={this._update('env')} style={{
        fontFamily: 'Fira Code'
      }} /></label></p>
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
  return <span style={Object.assign({}, styles.container, containerStyle)}><Element {...rest} style={Object.assign({}, styles.input, style)} /></span>
}
