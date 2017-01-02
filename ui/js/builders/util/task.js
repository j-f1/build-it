import React from 'react'
import uuid from 'uuid'

const ids = new WeakMap()

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
        result.push(<span key={i}>{segment}</span>)
        result.push(<span key={'|' + i} className='|' />)
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
