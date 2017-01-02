import EventEmitter from 'events'

import moment from 'moment'
import React from 'react'

import Observable from './observable'
import Task from './task'

export default class Builder extends EventEmitter {
  constructor (opts, defaults) {
    super()
    this.opts = Object.assign({
      task: 'Building',
      label: []
    }, defaults, opts)
    if (!Array.isArray(this.opts.task)) {
      this.opts.task = [this.opts.task]
    }
    if (!Array.isArray(this.opts.label)) {
      this.opts.label = [this.opts.label]
    }
    this._task = new Task({
      label: [...this.opts.label, ...this.opts.task, 'Initializing'],
      progress: 0
    })
    this.task = new Observable(this._task)
    this.on('build', () => {
      this.task.value = this._task
    })
    this.on('built', () => {
      const time = moment().calendar()
      setTimeout(() => {
        this.task.value = new Task({
          label: [
            ...this.opts.label,
            <span>
              Build <strong>
                {this.buildOK() ? 'Succeeded' : 'Failed'}
              </strong>
            </span>,
            time
          ],
          progress: 1
        })
      })
    })
  }
  toString () {
    return this.constructor.name + ': ' + this.task.value.toString()
  }
  updateProgress ({ progress, message }) {
    const task = this.task.value
    if (progress) {
      task.progress = progress
    }
    if (message) {
      task.label = task.label.slice(0, -1).concat(message)
    }
    this.task.value = task
  }
  async init () {
    // parse config
    throw new Error('must specify an init handler')
  }
  async start () {
    throw new Error('must specify a start function')
  }
  async stop () {
    throw new Error('must specify a stop function')
  }
}
