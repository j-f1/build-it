import EventEmitter from 'events'

let gblID = 0

export default class IPCHandler extends EventEmitter {
  constructor (proc) {
    super()
    this._proc = proc
    this._proc.on('message', this._router.bind(this))
  }
  _router ({ message, data = '{}' }) {
    this.emit(message, parse(data))
  }
  send (message, data = {}, wantsReply = true) {
    const id = gblID++
    this._proc.send({
      message,
      data,
      id
    })
    if (wantsReply) {
      return new Promise(resolve => {
        this.once(`reply to ${id}`, resolve)
      })
    }
  }
}

// https://github.com/yyx990803/circular-json-es6/blob/6ecd6d743b7eb3d240153dda7f7c4f9e7224f7e5/index.js; modified
// I don’t want to depend because it could change, and I can’t require() in the wrapper

const parse = (() => {
  function decode (list, reviver) {
    var i = list.length
    var j, k, key, value
    while (i--) {
      let data = list[i]
      if (isPlainObject(data)) {
        var keys = Object.keys(data)
        for (j = 0, k = keys.length; j < k; j++) {
          key = keys[j]
          value = list[data[key]]
          if (reviver) value = reviver.call(data, key, value)
          data[key] = value
        }
      } else if (Array.isArray(data)) {
        for (j = 0, k = data.length; j < k; j++) {
          value = list[data[j]]
          if (reviver) value = reviver.call(data, j, value)
          data[j] = value
        }
      }
    }
  }

  function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  return function parse (data, reviver) {
    var hasCircular = /^\s/.test(data)
    if (!hasCircular) {
      return arguments.length === 1
      ? JSON.parse(data)
      : JSON.parse(data, reviver)
    } else {
      var list = JSON.parse(data)
      decode(list, reviver)
      return list[0]
    }
  }
})()
