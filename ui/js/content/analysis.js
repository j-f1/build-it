import PropTypes from 'prop-types'
import React from 'react'

export default class BundleAnalysis extends React.Component {
  constructor (...args) {
    super(...args)
    this._webviewRef = this._webviewRef.bind(this)
    this._reloadWebview = this._reloadWebview.bind(this)
  }
  componentDidMount () {
    this.props.status.on('built', this._reloadWebview)
  }
  componentWillUnmount () {
    this.props.status.removeListener('built', this._reloadWebview)
  }
  _reloadWebview () {
    this.webview && this.webview.reload()
  }
  _webviewRef (ref) {
    this.webview = ref
  }
  render () {
    return <webview hidden={this.props.hidden} ref={this._webviewRef} src={this.props.analyzer} style={this.props.style} />
  }
}
BundleAnalysis.propTypes = {
  status: PropTypes.object.isRequired,
  analyzer: PropTypes.string.isRequired,
  style: PropTypes.object,
  hidden: PropTypes.bool.isRequired
}
