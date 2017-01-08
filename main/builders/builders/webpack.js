const path = require('path')

const webpack = require('webpack')
const { ProgressPlugin } = webpack
const clone = require('lodash.clonedeep')
const titleCase = require('title-case')
const ify = require('promisify-node')

const Builder = require('../util/builder')

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

exports = module.exports = class WebpackHandler extends Builder {
  constructor (opts) {
    super(opts, {
      configPath: null,
      label: 'webpack'
    })
  }
  init () {
    return new Promise((resolve, reject) => {
      // const content = fs.readFileSync(this.opts.configPath, 'utf-8')
      this.config = require(path.resolve(this.opts.configPath))
      this.compiler = webpack(transform(this.config, Object.assign({}, this.opts, {
        progress: (progress, message) => {
          if (!progress) this.emit('build')
          this.updateProgress({
            progress,
            message: titleCase(message)
          })
        }
      })))
      resolve()
    })
  }
  start () {
    return new Promise((resolve, reject) => {
      const watching = this.compiler.watch({}, (...args) => {
        this.stats = args[1]
        this.emit('built', ...args)
      })
      this._stop = watching.close
      resolve()
    })
  }
  stop () {
    return new Promise((resolve, reject) => {
      if (!this._stop) {
        resolve(false)
      }
      ify(this._stop)().then(() => {
        this._stop = null
        resolve(true)
      })
    })
  }
  buildOK () {
    if (!this.stats) {
      return undefined
    }
    return !this.errors.length
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
