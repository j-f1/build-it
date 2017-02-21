import reactCSS, * as _reactCSSKeys from 'reactcss'
import { classJoin } from 'css-classname'
import info from 'pkginfo'
import React from 'react'
import depd from 'depd'
import plur from 'plur'

import css from './css'

const mod = Object.create(window.module)
mod.exports = Object.create(window.module.exports)
info(mod)
export const meta = mod.exports
export const deprecate = depd(meta.name)

export const cx = deprecate.function((...args) => {
  return classJoin(...args)
}, 'Don’t use `cx`. Use `reactCSS`/`st` instead.')

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

export function debounceRAF (f) {
  let latestArgs = []
  let self = this
  let requested = false
  return function (...args) {
    latestArgs = args
    self = this

    if (!requested) {
      window.requestAnimationFrame(() => {
        requested = false
        f.apply(self, latestArgs)
      })
      requested = true
    }
  }
}

export function cancel (event) {
  event.preventDefault()
  event.stopPropagation()
}

export function round (num, places) {
  // from  http://stackoverflow.com/a/12830454/5244995
  var number = Math.round(num * Math.pow(10, places)) / Math.pow(10, places)
  if (num - number > 0) {
    return (number + Math.floor(2 * Math.round((num - number) * Math.pow(10, (places + 1))) / 10) / Math.pow(10, places))
  } else {
    return number
  }
}

export function toTimeString (sec) {
  sec = Math.abs(sec)
  if (sec < 1) {
    return `${Math.round(sec * 1000)}ms`
  } else if (sec < 10) {
    const Δt = round(sec, 2)
    return `${Δt} ${plur('second', Δt)}`
  } else if (sec < 60) {
    const Δt = round(sec, 1)
    return `${Δt} ${plur('second', Δt)}`
  } else if (sec < (60 * 60)) {
    return `${Math.round(sec / 60)} min ${toTimeString(sec % 60)}`
  }
  return `${Math.round(sec / (60 * 60))} hr ${toTimeString(sec % (60 * 60))}`
}

export const Input = st.handleFocus(_Input)
function _Input (props) {
  const { el: Element = 'input', style, inputStyle, focused, blurred, ...rest } = props
  const styles = st({
    default: {
      container: {
        display: 'inline-flex',
        borderRadius: 2,
        transition: 'box-shadow .25s cubic-bezier(0.165, 0.840, 0.440, 1)' // easeOutQuart
      },
      input: {
        flex: 1,
        width: '100%',
        border: '1px solid',
        borderColor: '#BFBFBF',
        transition: 'border .25s cubic-bezier(0.165, 0.840, 0.440, 1)', // easeOutQuart
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
  return <span style={Object.assign({}, styles.container, style)}><Element {...rest} style={Object.assign({}, styles.input, inputStyle)} /></span>
}
