import Combokeys from 'combokeys'
import React from 'react'

import { st, ctxt, vars } from '../util'

import BundleAnalysis from './analysis'
import DetailView from './detail-view'
import Settings from './settings'
import Info from './info'
import Logs from './logs'
import Tab from './tab'

export default class Content extends React.Component {
  constructor (...args) {
    super(...args)
    this._select = this._select.bind(this)
    this.select = this.select.bind(this)
    this.state = {
      tab: 2
    }
    this._tabNames = ['warnings', 'errors', 'info', 'analyzer', 'settings']
  }
  get tabs () {
    return [{
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
      content: <BundleAnalysis />
    }, {
      title: 'Logs',
      icon: 'tasks',
      content: <Logs logs={this.props.logs} />
    }, {
      title: 'Settings',
      icon: 'cog',
      pinned: true,
      content: <Settings />
    }]
  }
  select (name) {
    this._tabNames.includes(name) && this._select(this._tabNames.indexOf(name))
  }
  _select (tab) {
    this.setState({ tab })
  }
  componentDidMount () {
    this.shortcuts = new Combokeys(document.documentElement)
    this.shortcuts.bind('ctrl+tab', () => {
      this.setState(({ tab }) => ({
        tab: (tab + 1) % this.tabs.length
      }))
    })
    this.shortcuts.bind('ctrl+shift+tab', () => this.setState(({ tab }) => ({
      tab: tab > 0 ? tab - 1 : this.tabs.length - 1
    })))
  }
  componentWillUnmount () {
    this.shortcuts.detach()
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
          margin: 0
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
    return <div style={styles.container}>
      <ul style={styles.tabBar}>
        {this.tabs.map((opts, i) => <Tab
          key={i}
          selected={i === this.state.tab}
          onSelect={() => this._select(i)}
          {...opts}
          {...st.loop(i, this.tabs.length)} />
        )}
      </ul>
      {this.tabs.map((data, i) => <DetailView key={i} style={styles.detail} data={data} hidden={i !== this.state.tab} {...this.props} />)}
    </div>
  }
}
Content.contextTypes = ctxt('blurred')
