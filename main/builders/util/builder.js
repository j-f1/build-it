const EventEmitter = require('events')

const _keeper = new Set()

exports = module.exports = class Builder extends EventEmitter {
  constructor (opts) {
    super()
    this.opts = opts
    _keeper.add(this)
  }
  toString () {
    return this.constructor.name + ': ' + this.task.value.toString()
  }
  __del__ () {
    this.removeAllListeners()
    _keeper.delete(this)
  }
  init () {
    // parse config
    return Promise.reject(new Error('must specify an init handler'))
  }
  start () {
    return Promise.reject(new Error('must specify a start function'))
  }
  stop () {
    return Promise.reject(new Error('must specify a stop function'))
  }
}
