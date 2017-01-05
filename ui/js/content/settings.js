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
      <p><label>Environment: <input value={this.state.env} onChange={this._update('env')} /></label></p>
    </form>
  }
}
