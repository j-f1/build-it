import fs from 'fs'
import vm from 'vm'

import webpack, { ProgressPlugin } from 'webpack'
import clone from 'lodash.clonedeep'
import titleCase from 'title-case'
import ify from 'promisify-node'

import Builder from './util/builder'

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
      configPath: null
    })
  }
  async init () {
    const content = fs.readFileSync(this.opts.configPath, 'utf-8')
    this.config = vm.runInThisContext(content)
    this.compiler = webpack(transform(this.config, {
      progress: (progress, message) => this.updateProgress({
        progress,
        message: titleCase(message)
      })
    }))
  }
  async start () {
    this._stop = this.compiler.watch({}, (...args) => {
      this.stats = args[1]
      this.emit('built', ...args)
    }).close
  }
  async stop () {
    if (!this._stop) {
      return false
    }
    await ify(this._stop)()
    this._stop = null
    return true
  }
  buildOK () {
    if (!this.stats) {
      return undefined
    }
    return !!this.errors.length
  }

  get notices () {
    return []
  }
  get warnings () {
    if (!this.stats) {
      return []
    }
    return this.stats.compilation.warnings
  }
  get errors () {
    if (!this.stats) {
      return []
    }
    return this.stats.compilation.errors
  }
}
