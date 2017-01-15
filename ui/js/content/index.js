import React from 'react'
import { st, ctxt, vars } from '../util'
import DetailView from './detail-view'
import Tab from './tab'
import Settings from './settings'
import Info from './info'

export default class Content extends React.Component {
  constructor (...args) {
    super(...args)
    this._webviewRef = this._webviewRef.bind(this)
    this._reloadWebview = this._reloadWebview.bind(this)

    this._select = this._select.bind(this)
    this.select = this.select.bind(this)
    this.state = {
      tab: 2
    }
    this._tabNames = ['warnings', 'errors']
  }
  select (name) {
    this._tabNames.includes(name) && this._select(this._tabNames.indexOf(name))
  }
  _select (tab) {
    this.setState({ tab })
  }
  _reloadWebview () {
    this.webview && this.webview.reload()
  }
  componentDidMount () {
    this.props.status.on('built', this._reloadWebview)
  }
  componentWillUnmount () {
    this.props.status.removeListener('built', this._reloadWebview)
  }
  _webviewRef (ref) {
    this.webview = ref
  }
  render () {
    const styles = st({
      default: {
        container: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden'
        },
        detail: {
          flex: 1,
          overflow: 'auto',
          margin: 0,
          paddingTop: '1em'
        },
        tabBar: {
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          height: 24,
          minHeight: 24,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderBottomColor: 'hsl(0, 0%, 65%)',
          backgroundImage: 'linear-gradient(to bottom, hsl(0, 0%, 78%), hsl(0, 0%, 72%))',
          backgroundColor: 'transparent',
          backgroundSize: '100% 200%',
          marginTop: -1
        }
      },
      blurred: {
        tabBar: {
          borderBottomColor: 'hsl(0, 0%, 85%)',
          backgroundImage: 'none',
          backgroundColor: 'hsl(0, 0%, 92%)'
        }
      }
    }, this.context)
    const tabs = [{
      title: 'Warning',
      plural: 's',
      icon: 'warning',
      items: this.props.warnings,
      iconStyle: {
        color: vars.warning
      }
    }, {
      title: 'Error',
      plural: 's',
      icon: 'exclamation-circle',
      items: this.props.errors,
      iconStyle: {
        color: vars.error
      }
    }, {
      title: 'Info',
      icon: 'info-circle',
      content: <Info stats={this.props.stats} />
    }, {
      title: 'Bundle Analysis',
      content: <webview ref={this._webviewRef} src={this.props.analyzer} style={{
        paddingTop: 0
      }} />
    }, {
      title: 'Settings',
      icon: 'cog',
      pinned: true,
      content: <Settings />
    }]
    return <div style={styles.container}>
      <ul style={styles.tabBar}>
        {tabs.map((opts, i) => <Tab
          key={i}
          selected={i === this.state.tab}
          onSelect={() => this._select(i)}
          {...opts}
          {...st.loop(i, tabs.length)} />
        )}
      </ul>
      <DetailView style={styles.detail} data={tabs[this.state.tab]} />
    </div>
  }
}
Content.contextTypes = ctxt('blurred')
