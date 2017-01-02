import EventEmitter from 'events'

import titleCase from 'title-case'

import Observable from './observable'

export default class Builder extends EventEmitter {
  constructor (opts, defaults) {
    super()
    this.opts = Object.assign({}, defaults, opts)
    this.task = new Observable()
  }
  toString () {
    return this.constructor.name + ': ' + this.task.value.toString()
  }
  updateProgress (percent, message) {
    const task = this.task.value
    task.progress = percent
    if (message) {
      task.label = task.label.slice(0, -1).concat(titleCase(message))
    }
    this.task.value = task
  }
}
