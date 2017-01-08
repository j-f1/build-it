import reactCSS, * as _reactCSSKeys from 'reactcss'
import { classJoin } from 'css-classname'
import React from 'react'

import css from './css'

export const cx = (...args) => {
  console.error('Don’t use `cx`. Use `reactCSS`/`st` instead.')
  return classJoin(...args)
}
export function fa (icon, ...args) {
  return classJoin('fa', `fa-${icon}`, ...args)
}

export function m (...args) {
  return Object.assign({}, ...args)
}

export const st = reactCSS
Object.assign(st, _reactCSSKeys)
if (!st.handleFocus) {
  const focus = (Component, Span = 'span') => {
    return class Focus extends React.Component {
      constructor (...args) {
        super(...args)
        this.state = { focused: false, blurred: true }
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
      }
      handleFocus () {
        this.setState({ focused: true, blurred: false })
      }
      handleBlur () {
        this.setState({ focused: false, blurred: true })
      }

      render () {
        return (
          <Span onFocus={this.handleFocus} onBlur={this.handleBlur}>
            <Component {...this.props} {...this.state} />
          </Span>
        )
      }
    }
  }
  st.handleFocus = focus
}
export const vars = css

export const res = {
  hidpi: window.matchMedia('(min-resolution: 2dppx)').matches
}

const contextTypes = {}
registerCtxt('blurred', {
  blurred: React.PropTypes.bool
})
registerCtxt('mini', {
  mini: React.PropTypes.bool
})

export function registerCtxt (type, value) {
  if (contextTypes[type]) {
    return false
  }
  contextTypes[type] = value
  return true
}
export function ctxt (...types) {
  return Object.assign({}, ...types.map(type => contextTypes[type]))
}
