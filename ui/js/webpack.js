import fs from 'fs'
import vm from 'vm'

import webpack, { ProgressPlugin } from 'webpack'
import clone from 'lodash.clonedeep'
import ify from 'promisify-node'

import Builder from './builder'
import Task from './task'

function transform (config, opts) {
  if (typeof config === 'function') {
    return transform(config(opts.env), opts)
  }
  if (Array.isArray(config)) {
    return config.map(clone).map(conf => _transform(conf, opts))
  }
  return _transform(clone(config), opts)
}
function _transform (config, { progress }) {
  if (!config.plugins) config.plugins = []
  config.plugins.unshift(new ProgressPlugin(progress))
  return config
}

export default class WebpackHandler extends Builder {
  constructor (opts) {
    super(opts, {
      configPath: null,
      task: 'Building'
    })
  }
  async init () {
    const content = fs.readFileSync(this.opts.configPath, 'utf-8')
    this.config = vm.runInThisContext(content)
    this.compiler = webpack(transform(this.config, {
      progress: this.updateProgress.bind(this)
    }))
    if (!Array.isArray(this.opts.task)) {
      this.opts.task = [this.opts.task]
    }
    this.task.value = new Task({
      label: [...this.opts.task, 'Initializing'],
      progress: 0
    })
  }
  async start () {
    this._stop = this.compiler.watch({}, (...args) => this.emit('built', ...args)).close
  }
  async stop () {
    if (!this._stop) {
      return false
    }
    await ify(this._stop)()
    this._stop = null
    return true
  }
}
