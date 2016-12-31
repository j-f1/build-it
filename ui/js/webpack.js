import webpack, { ProgressPlugin } from 'webpack'
import clone from 'lodash.clonedeep'
import titleCase from 'title-case'

import Observable from './observable'
import Task from './task.js'

export default class WebpackHandler {
  static transform (config, opts) {
    if (typeof config === 'function') {
      return WebpackHandler.transform(config(opts.env), opts)
    }
    if (Array.isArray(config)) {
      return config.map(clone).map(conf => WebpackHandler._transform(conf, opts))
    }
    return WebpackHandler._transform(clone(config), opts)
  }
  static _transform (config, { progress }) {
    if (!config.plugins) config.plugins = []
    config.plugins.unshift(new ProgressPlugin(progress))
    return config
  }
  constructor ({ config, task = 'Building' }) {
    this.compiler = webpack(WebpackHandler.transform(config, {
      progress: this._progress.bind(this)
    }))
    if (!Array.isArray(task)) {
      task = [task]
    }
    this.task = new Observable()
    this.task.value = new Task({
      label: [...task, 'Initializing'],
      progress: 0
    })
  }
  _progress (percent, message) {
    const task = this.task.value
    task.progress = percent
    if (message) {
      task.label = task.label.slice(0, -1).concat(titleCase(message))
    }
    this.task.value = task
  }
  toString () {
    return 'webpack:'
  }
}
