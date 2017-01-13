const path = require('path')
const os = require('os')

const webpack = require('webpack')
const { ProgressPlugin } = webpack
const RequestShortener = require('webpack/lib/RequestShortener.js')
const clone = require('lodash.clonedeep')
const titleCase = require('title-case')
const ify = require('promisify-node')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const uuid = require('uuid')

const Builder = require('../util/builder')

const shortener = new RequestShortener(process.cwd())
function _simplify (items) {
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
function _transform (config, { progress, visualizerOutput }) {
  if (!config.plugins) config.plugins = []
  config.plugins.unshift(new ProgressPlugin(progress))
  config.plugins.unshift(new BundleAnalyzerPlugin({
    reportFilename: path.join(...('..!'.repeat(100).split('!')), visualizerOutput),
    openAnalyzer: false,
    logLevel: 'warn',
    analyzerMode: 'static'
  }))
  return config
}

exports = module.exports = class WebpackHandler extends Builder {
  constructor (opts) {
    super(opts, {
      configPath: null,
      label: 'webpack',
      visualizerOutput: path.join(os.tmpdir(), uuid(), 'stats.html')
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
    return _simplify(this.stats.compilation.warnings)
  }
  get errors () {
    if (!this.stats) {
      return []
    }
    return _simplify(this.stats.compilation.errors)
  }
}
