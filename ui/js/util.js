import reactCSS, * as _reactCSSKeys from 'reactcss'
import { classJoin } from 'css-classname'
import React from 'react'

import css from './css'

export const cx = (...args) => {
  // console.error('Don’t use cx. Use `reactCSS`/`st` instead.')
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
export const vars = css

export const res = {
  hidpi: window.matchMedia('(min-resolution: 2dppx)').matches
}

const contextTypes = {}
registerCtxt('blurred', {
  blurred: React.PropTypes.bool
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
