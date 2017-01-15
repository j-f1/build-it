// core
const path = require('path')
const os = require('os')

// webpack
const RequestShortener = require('webpack/lib/RequestShortener.js')
const webpack = require('webpack')

// webpack plugins
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const DashboardPlugin = require('webpack-dashboard/plugin')

// npm
const clone = require('lodash.clonedeep')
const titleCase = require('title-case')
const ify = require('promisify-node')
const getPort = require('get-port')
const uuid = require('uuid')

// local
const Builder = require('../util/builder')

const shortener = new RequestShortener(process.cwd())
function simplify (items) {
  return items.map(item => {
    return {
      loc: item.origin.readableIdentifier(shortener),
      message: item.message.trim()
    }
  })
}

function transform (config, opts) {
  if (typeof config === 'function') {
    return transform(config(opts.env), opts)
  }
  if (Array.isArray(config)) {
    return config.map(clone).map(conf => _transform(conf, opts))
  }
  return _transform(clone(config), opts)
}
function _transform (config, { progress, port, visualizerOutput }) {
  if (!config.plugins) config.plugins = []
  config.plugins.unshift(new DashboardPlugin({
    port,
    handler: progress
  }))
  config.plugins.unshift(new BundleAnalyzerPlugin({
    reportFilename: path.join(...('..!'.repeat(100).split('!')), visualizerOutput),
    openAnalyzer: false,
    logLevel: 'warn',
    analyzerMode: 'static'
  }))
  return config
}

const DEFAULT_PORT = Symbol('default port')

exports = module.exports = class WebpackHandler extends Builder {
  constructor (opts) {
    super(opts, {
      port: DEFAULT_PORT,
      configPath: null,
      label: 'webpack',
      visualizerOutput: path.join(os.tmpdir(), uuid(), 'stats.html')
    })
  }
  init () {
    let p
    if (this.opts.port === DEFAULT_PORT) {
      p = getPort()
    } else {
      p = Promise.resolve(this.opts.port)
    }
    return p.then(port => {
      this.config = require(path.resolve(this.opts.configPath))
      this.compiler = webpack(transform(this.config, Object.assign({}, this.opts, {
        port,
        progress: (args) => {
          const ob = {}
          for (const { type, value } of args) {
            ob[type] = value !== undefined ? value : true
          }
          if (ob.stats) {
            this.setStats(ob.stats.data)
          }
          this._updateProgress(ob)
        }
      })))
    })
  }
  _updateProgress ({ status, progress, operations }) {
    this.updateProgress({
      progress,
      message: [status, titleCase(operations)]
    })
  }
  start () {
    return new Promise((resolve, reject) => {
      const watching = this.compiler.watch({}, (...args) => {
        this.stats = args[1]
        this.emit('built')
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
    return simplify(this.stats.compilation.warnings)
  }
  get errors () {
    if (!this.stats) {
      return []
    }
    return simplify(this.stats.compilation.errors)
  }
}
