import moment from 'moment'
import React from 'react'
import uuid from 'uuid'

import { st, res } from '../../util'

const ids = new WeakMap()

function _str (value) {
  if (React.isValidElement(value)) {
    return value
  } else if (typeof value === 'string') {
    return value
  } else if (moment.isMoment(value)) {
    return value.calendar()
  } else if (value instanceof Date) {
    return moment(value).calendar()
  } else {
    return '{invalid object}'
  }
}

export default class Task {
  constructor ({ label, progress, percent = 0, ...rest }) {
    this.label = label
    this.progress = progress || percent / 100
    this.opts = rest
    ids.set(this, uuid())
  }
  get labelJSX () {
    if (Array.isArray(this.label)) {
      const result = []
      this.label.forEach((segment, i) => {
        result.push(<span key={i}>{_str(segment)}</span>)
        result.push(<VerticalBar key={'|' + i} />)
      })
      result.pop()
      return <span>{result}</span>
    }
    return <span>{this.label}</span>
  }
  get percent () {
    return this.progress * 100
  }
  set percent (percent) {
    this.progress = percent / 100
  }
  get id () {
    return ids.get(this)
  }

  toString () {
    return '+'.repeat((this.progress * 20 | 0)) + '-'.repeat(20 - (this.progress * 20 | 0)) + ': ' + this.label.join(' | ')
  }
}

function VerticalBar () {
  const styles = st({
    default: {
      bar: {
        display: 'inline-block',
        height: '1.1em',
        width: 1,
        margin: '0 0.75em',
        background: 'currentColor',
        verticalAlign: 'middle',
        marginTop: -2
      }
    },
    hidpi: {
      transform: 'scaleX(0.5)'
    }
  }, res)
  return <span style={styles.bar} />
}
