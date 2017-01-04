import React from 'react'
import { fa, st, ctxt } from './util'

export default class Content extends React.Component {
  constructor (...args) {
    super(...args)
    this._select = this._select.bind(this)
    this.select = this.select.bind(this)
    this.state = {
      tab: 0
    }
    this._tabNames = ['warnings', 'errors']
  }
  select (name) {
    this._tabNames.includes(name) && this._select(this._tabNames.indexOf(name))
  }
  _select (tab) {
    this.setState({ tab })
  }
  render () {
    const styles = st({
      default: {
        tabBar: {
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          height: 24,
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
        color: 'yellow'
      }
    }, {
      title: 'Error',
      plural: 's',
      icon: 'exclamation-circle',
      items: this.props.errors,
      iconStyle: {
        color: 'red'
      }
    }]
    const tabContents = [
      'Warn!',
      'ERR!'
    ]
    return <div>
      <ul style={styles.tabBar}>
        {tabs.map((opts, i) => <Tab
          key={i}
          selected={i === this.state.tab}
          onSelect={() => this._select(i)}
          {...opts}
          {...st.loop(i, tabs.length)} />
        )}
      </ul>
      {tabContents[this.state.tab]}
    </div>
  }
}
Content.contextTypes = ctxt('blurred')

function Tab (props, context) {
  return <li onMouseDown={props.onSelect} style={{ flex: 1 }}>
    <TabContent {...props} />
  </li>
}
Tab.contextTypes = ctxt('blurred')

const TabContent = st.handleHover(_TabContent)
function _TabContent (props, context) {
  const styles = st({
    default: {
      tab: {
        width: '100%',
        // transition: `all ${vars.duration}`,

        cursor: 'default',
        color: 'rgba(0, 0, 0, 0.55)',

        display: 'flex',
        position: 'relative',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 6px',
        minWidth: 24,
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(to bottom, hsl(0, 0%, 78%), hsl(0, 0%, 72%))',
        backgroundSize: '100% 200%',
        height: '100%',
        lineHeight: '15px',
        outline: 'none',
        backgroundPosition: '0 0',

        borderTop: '1px solid',
        borderLeft: '1px solid',
        borderTopColor: 'hsl(0, 0%, 65%)',
        borderLeftColor: 'hsl(0, 0%, 59%)'
      },
      activeTab: {
        borderTopColor: 'hsl(0, 0%, 74%)',
        backgroundImage: 'linear-gradient(to bottom, hsl(0, 0%, 87%), hsl(0, 0%, 82%))',
        backgroundSize: '100% 100%',
        color: 'hsla(0, 0%, 0%, 0.7)'
      }
    },
    blurred: {
      tab: {
        borderLeftColor: 'hsl(0, 0%, 85%)',
        borderTopColor: 'hsl(0, 0%, 85%)',

        backgroundImage: 'none',
        backgroundColor: 'hsl(0, 0%, 92%)'
      },
      activeTab: {
        borderLeftColor: 'hsl(0, 0%, 85%)',
        borderTopColor: 'hsl(0, 0%, 85%)',

        backgroundImage: 'none',
        backgroundColor: 'hsl(0, 0%, 96%)'
      }
    },
    'first-child': {
      tab: {
        borderLeftWidth: 0
      }
    },
    hover: {
      tab: {
        color: 'hsla(0, 0%, 0%, 0.6)',
        backgroundPosition: '0 100%',
        borderTopColor: 'hsl(0, 0%, 59%)',
        borderLeftColor: 'hsl(0, 0%, 59%)'
      }
    }
  }, props, context)
  return <div style={props.selected
    ? Object.assign({}, styles.tab, styles.activeTab)
    : styles.tab}>
    <i className={fa(props.icon)} style={props.items.length ? props.iconStyle : {}} />
    {`\u{200B} ${props.items.length} ${props.title}${props.items.length === 1 ? '' : props.plural}`}
  </div>
}
_TabContent.contextTypes = ctxt('blurred')
