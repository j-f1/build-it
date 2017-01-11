import moment from 'moment'
import React from 'react'
import weak from 'weak'

import Observable from './observable'
import { remote } from 'electron'
import Task from './task'
import _proxy from './proxy'

const { makeBuilder } = remote.require('./builders')

export default class BuilderProxy {
  constructor (opts, defaults) {
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

    this._main = makeBuilder({
      name: this.constructor.name,
      opts: this.opts,
      updateProgress: this.updateProgress.bind(this)
    })
    this._listeners = new Set()
    _proxy(this, this._main, 'start', 'stop', 'removeListener', /* 'emit', */ 'buildOK')
    window.addEventListener('beforeunload', () => {
      this.stop().then(() => {
        this._main.__del__()
        this._main = null
      })
    })

    this._task = new Task({
      label: [...this.opts.label, ...this.opts.task, 'Initializing'],
      progress: 0
    })
    this.task = new Observable(this._task)
    this.on('build', () => {
      this.task.value = this._task
    })
    this.on('built', () => setTimeout(() => {
      const time = moment()
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
    }, 100))
  }
  toString () {
    return `${this.constructor.name}<${this.opts.realName}>: ${this.task.value.toString()}`
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
  async init (...args) {
    weak(this, this._main.__del__()) // tell IPC to remove object when this one goes away.
    return await this._main.init(...args)
  }

  on (...args) {
    this._listeners.add(args)
    this._main.on(...args)
    return this
  }
  once (...args) {
    this._main.once(...args)
    return this
  }
}
