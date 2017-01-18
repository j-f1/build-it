// core
import path from 'path'
import os from 'os'
import { fork } from 'child_process'

// npm
import getPort from 'get-port'
import uuid from 'uuid'

// webpack
import RequestShortener from 'webpack/lib/RequestShortener.js'

// local
import Builder from '../util/builder'
import IPCHandler from '../util/ipc.js'

const DEFAULT_PORT = Symbol('default port')

const shortener = new RequestShortener(process.cwd())
function simplify (items) {
  return items.map(item => {
    if (!item.origin) return item
    return {
      loc: item.origin.readableIdentifier(shortener),
      message: item.message.trim()
    }
  })
}

export default class WebpackHandler extends Builder {
  constructor (opts) {
    super(opts, {
      port: DEFAULT_PORT,
      configPath: null,
      label: 'webpack',
      visualizerOutput: path.join(os.tmpdir(), uuid(), 'stats.html')
    }, 'WebpackHandler')
  }
  async init (opts) {
    let port
    if (this.opts.port === DEFAULT_PORT) {
      port = await getPort()
    } else {
      port = this.opts.port
    }
    this._proc = fork(path.join(require('electron').remote.app.getAppPath(), 'ui', 'js', 'builders', 'webpack', 'wrapper'), {
      cwd: path.dirname(path.resolve(this.opts.configPath)),
      silent: true,
      env: {
        ELECTRON_RUN_AS_NODE: 1
      }
    })
    this._proc.stdout.on('data', val => console.log(String(val)))
    this._proc.stderr.on('data', val => console.warn(String(val)))

    this._ipc = new IPCHandler(this._proc)
    this._ipc.on('set stats', stats => this.setStats(stats))
    this._ipc.on('built', () => this.emit('built'))
    this._ipc.on('update progress', stuff => this.updateProgress(stuff))
    return this._ipc.send('init', {
      port,
      opts: Object.assign({}, this.opts, opts)
    })
  }
  start () {
    return this._ipc.send('start')
  }
  stop () {
    return this._ipc.send('stop')
  }
  kill () {
    return this.stop().then(() => {
      this._proc.kill()
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
    return simplify(this.stats.warnings)
  }
  get errors () {
    if (!this.stats) {
      return []
    }
    return simplify(this.stats.errors)
  }
}
