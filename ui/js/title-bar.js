import React from 'react'
import Status from './status'
import { st, res, ctxt } from './util'

export const TitleBarItem = st.handleActive(_TitleBarItem)
_TitleBarItem.contextTypes = ctxt('blurred')
function _TitleBarItem (props, context) {
  props = Object.assign({
    button: true,
    component: 'button'
  }, props)
  if (!props.button) {
    props.active = false
  }
  const Component = props.component
  const { active, button, component, style, ...rest } = props
  component
  const styles = st({
    default: {
      item: {
        margin: '0 7px',
        appearance: 'none',
        padding: '3px 10px',

        background: 'linear-gradient(hsl(0, 0%, 99%), hsl(0, 0%, 94%))',
        boxShadow: 'hsla(0, 0%, 0%, 0.3) 0 1px 1px -1px',

        borderRadius: 4,
        border: '1px solid',
        borderColor: 'hsl(0, 1%, 82%)',
        borderTopColor: 'hsl(0, 0%, 83%)',
        borderBottomColor: 'hsl(0, 0%, 76%)',
        color: 'hsl(0, 0%, 30%)'
      }
    },
    button: {
      item: {
        WebkitAppRegion: 'no-drag'
      }
    },
    hidpi: {
      item: {
        // fontSize: '2em',
        // transform: 'scale(0.5)',
        // borderRadius: 8,
        // padding: '6px 20px',
        // boxShadow: 'hsla(0, 0%, 0%, 0.3) 0 2px 2px -2px',

        border: '0.5px solid',
        borderColor: 'hsl(0, 0%, 78%)',
        borderTopColor: 'hsl(0, 0%, 80%)',
        borderBottomColor: 'hsl(0, 0%, 65%)'
      }
    },
    active: {
      item: {
        background: 'linear-gradient(hsl(0, 0%, 89%), hsl(0, 0%, 86%))',
        boxShadow: 'hsla(0, 0%, 0%, 0.3) 0 1px 1px -1px, inset 0 1px 1px -1px white'
      }
    },
    blurred: {
      item: {
        opacity: 0.65,
        borderColor: 'hsla(0, 0%, 0%, 0.15)',
        background: 'transparent',
        color: 'hsla(0, 0%, 30%, 0.65)',
        // hidpi: {
        boxShadow: 'none'
        // boxShadow: 'inset 0 0 1px 0 hsla(0, 0%, 0%, 0.1)'
        // }
      }
    }
  }, res, { active, button }, context)
  return <Component style={Object.assign({}, styles.item, style)} {...rest}>{props.children}</Component>
}

export default function TitleBar (props, context) {
  const styles = st({
    default: {
      titleBar: {
        paddingLeft: 71,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        height: 37,
        paddingTop: 3,
        paddingBottom: 3,
        whiteSpace: 'nowrap',

        outline: 'none',

        boxShadow: 'inset hsla(0, 0%, 100%, 0.5) 0 1px 1px',
        borderBottom: '1px solid',
        borderBottomColor: 'hsl(0, 0%, 74%)',
        background: 'linear-gradient(to bottom, hsl(0, 0%, 92%), hsl(0, 0%, 87%))',

        borderRadius: '5px 5px 0 0',
        fontSize: '0.8em',
        WebkitAppRegion: 'drag'
      }
    },
    blurred: {
      titleBar: {
        background: 'hsl(0, 0%, 96%)',
        borderBottomColor: '#DBDBDB',
        color: '#ACACAC'
      }
    }
  }, props, context, res)
  return <header style={styles.titleBar}>
    {props.leftItems}
    <Status tasks={props.tasks} issues={props.issues} />
    {props.rightItems}
  </header>
}
TitleBar.contextTypes = ctxt('blurred')
