import { spawn } from 'child_process'

import Builder from './util/builder'

const STARTING_RE = /^>>> Change detected to: (.+?)$/m
const DONE_RE = /^\s+write (.+?)$/m
const LISTEN_WARNING = /^\[Listen warning]:\n\s+Listen will be polling for changes. Learn more at https:\/\/github.com\/guard\/listen#polling-fallback./m
const ERROR_RE = /^\s+error ([^(]+) \((Line (\d+): .*)\)$/m

export default class SASSHandler extends Builder {
  constructor (opts) {
    super(opts, {
      from: undefined,
      to: undefined,
      args: []
    })
    this._status = {
      ok: undefined,
      warnings: [],
      errors: []
    }
  }
  async init () {}
  async start () {
    this._proc = spawn('sass', ['--watch', ...this.opts.args, `${this.opts.from}:${this.opts.to}`], {
      stdio: ['ignore', 'pipe', 'pipe']
    })
    this._proc.stdout.on('data', buf => this._handle(buf.toString()))
    this._proc.stderr.on('data', buf => this._handleErr(buf.toString()))
  }
  async stop () {
    this._proc.kill()
    this._proc = null
  }
  _handle (msg) {
    if (STARTING_RE.exec(msg)) {
      this.emit('build')
      this._status.ok = undefined
      this._status.warnings = []
      this._status.errors = []
      this.updateProgress({
        message: `Compiling ${STARTING_RE.exec(msg)[1]}`
      })
    } else if (DONE_RE.exec(msg)) {
      this._status.ok = true
      this.emit('built')
    } else if (ERROR_RE.exec(msg)) {
      this._status.errors = [ERROR_RE.exec(msg)[2]]
      this._status.ok = false
      this.emit('built')
    } else {
      console.log(msg)
    }
  }
  _handleErr (msg) {
    if (!LISTEN_WARNING.exec(msg)) {
      console.error(msg)
    }
  }
  get warnings () {
    return this._status.warnings
  }
  get errors () {
    return this._status.errors
  }
  buildOK () {
    return this._status.ok
  }
}
