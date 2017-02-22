import FA from 'react-fontawesome'
import React from 'react'

import { st, ctxt } from '../util'

export default function Tab (props, context) {
  return <li onMouseDown={props.onSelect} style={props.pinned ? {} : { flex: 1 }}>
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
        fontSize: 13,

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
    },
    pinned: {
      tab: {
        width: 28
      }
    }
  }, props, context)
  return <div style={props.selected
    ? Object.assign({}, styles.tab, styles.activeTab)
    : styles.tab}>
    {props.icon && <FA name={props.icon} style={(props.items || []).length ? props.iconStyle : {}} />}
    {props.pinned || `\u{200B} ${props.items ? props.items.length : ''} ${props.title}${(!props.items || props.items.length === 1) ? '' : props.plural}`}
  </div>
}
_TabContent.contextTypes = ctxt('blurred')
