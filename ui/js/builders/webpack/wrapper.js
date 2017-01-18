// NOTE: USE COMMONJS, not import ... from '...'
// core
const EventEmitter = require('events')
const path = require('path')

// webpack
const webpack = require('webpack')

// webpack plugins
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const DashboardPlugin = require('webpack-dashboard/plugin')

const ipc = new EventEmitter()
process.on('message', ({ message, id, data }) => {
  const cb = reply => {
    emit(`reply to ${id}`, reply)
  }
  ipc.emit(message, cb, data)
})
function emit (message, data) {
  process.send({
    message,
    data: stringify(data)
  })
}

ipc.once('init', (cb, { opts, port }) => {
  const config = require(opts.configPath)
  const compiler = webpack(transform(config, Object.assign({}, opts, {
    port,
    progress: (args) => {
      const ob = {}
      for (const { type, value } of args) {
        ob[type] = value !== undefined ? value : true
      }
      if (ob.stats) {
        emit('set stats', ob.stats.data)
      }
      emit('update progress', {
        progress: ob.progress,
        message: [ob.status, titleCase(ob.operations).trim()]
      })
    }
  })))

  let _stop = null
  ipc.on('start', cb => {
    const watching = compiler.watch({}, () => emit('built'))
    _stop = watching.close
    cb()
  })
  ipc.on('stop', (cb) => {
    if (!_stop) {
      cb(false)
    }
    _stop(() => {
      _stop = null
      cb(true)
    })
  })
  cb()
})

// ██    ██ ████████ ██ ██
// ██    ██    ██    ██ ██
// ██    ██    ██    ██ ██
// ██    ██    ██    ██ ██
//  ██████     ██    ██ ███████
// Stuff that should go in other files but can’t because the path is going wrong.

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

// https://github.com/yyx990803/circular-json-es6/blob/6ecd6d743b7eb3d240153dda7f7c4f9e7224f7e5/index.js; modified
const stringify = (() => {
  function encode (data, replacer, list, seen) {
    let stored, key, value, i, l
    let seenIndex = seen.get(data)
    if (seenIndex != null) {
      return seenIndex
    }
    let index = list.length
    if (isPlainObject(data)) {
      stored = {}
      seen.set(data, index)
      list.push(stored)
      let keys = Object.keys(data)
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i]
        value = data[key]
        if (replacer) {
          value = replacer.call(data, key, value)
        }
        stored[key] = encode(value, replacer, list, seen)
      }
    } else if (Array.isArray(data)) {
      stored = []
      seen.set(data, index)
      list.push(stored)
      for (i = 0, l = data.length; i < l; i++) {
        value = data[i]
        if (replacer) {
          value = replacer.call(data, i, value)
        }
        stored[i] = encode(value, replacer, list, seen)
      }
      seen.set(data, list.length)
    } else {
      index = list.length
      list.push(data)
    }
    return index
  }
  function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  return function stringify (data, replacer, space) {
    try {
      return arguments.length === 1
      ? JSON.stringify(data)
      : JSON.stringify(data, replacer, space)
    } catch (e) {
      let list = []
      encode(data, replacer, list, new Map())
      try {
        JSON.stringify(list)
      } catch (_) {
      }
      return space
      ? ' ' + JSON.stringify(list, null, space)
      : ' ' + JSON.stringify(list)
    }
  }
})()

// https://github.com/pvorb/clone/blob/e7631a4a9150b932796798bf4d364b59d81c04d6/clone.js; modified

const clone = (function () {
  'use strict'

  let NativeMap
  try {
    NativeMap = Map
  } catch (_) {
    // maybe a reference error because no `Map`. Give it a dummy value that no
    // value will ever be an instanceof.
    NativeMap = function () {}
  }

  let NativeSet
  try {
    NativeSet = Set
  } catch (_) {
    NativeSet = function () {}
  }

  let NativePromise
  try {
    NativePromise = Promise
  } catch (_) {
    NativePromise = function () {}
  }

  /**
  * Clones (copies) an Object using deep copying.
  *
  * This function supports circular references by default, but if you are certain
  * there are no circular references in your object, you can save some CPU time
  * by calling clone(obj, false).
  *
  * Caution: if `circular` is false and `parent` contains circular references,
  * your program may enter an infinite loop and crash.
  *
  * @param `parent` - the object to be cloned
  * @param `circular` - set to true if the object to be cloned may contain
  *    circular references. (optional - true by default)
  * @param `depth` - set to a number if the object is only to be cloned to
  *    a particular depth. (optional - defaults to Infinity)
  * @param `prototype` - sets the prototype to be used when cloning an object.
  *    (optional - defaults to parent prototype).
  * @param `includeNonEnumerable` - set to true if the non-enumerable properties
  *    should be cloned as well. Non-enumerable properties on the prototype
  *    chain will be ignored. (optional - false by default)
  */
  function clone (parent, circular, depth, prototype, includeNonEnumerable) {
    if (typeof circular === 'object') {
      depth = circular.depth
      prototype = circular.prototype
      includeNonEnumerable = circular.includeNonEnumerable
      circular = circular.circular
    }
    // maintain two arrays for circular references, where corresponding parents
    // and children have the same index
    let allParents = []
    let allChildren = []

    let useBuffer = typeof Buffer !== 'undefined'

    if (typeof circular === 'undefined') {
      circular = true
    }

    if (typeof depth === 'undefined') {
      depth = Infinity
    }

    // recurse this function so we don't reset allParents and allChildren
    function _clone (parent, depth) {
      // cloning null always returns null
      if (parent === null) { return null }

      if (depth === 0) {
        return parent
      }

      let child
      let proto
      if (typeof parent !== 'object') {
        return parent
      }

      if (parent instanceof NativeMap) {
        child = new NativeMap()
      } else if (parent instanceof NativeSet) {
        child = new NativeSet()
      } else if (parent instanceof NativePromise) {
        child = new NativePromise(function (resolve, reject) {
          parent.then(function (value) {
            resolve(_clone(value, depth - 1))
          }, function (err) {
            reject(_clone(err, depth - 1))
          })
        })
      } else if (clone.__isArray(parent)) {
        child = []
      } else if (clone.__isRegExp(parent)) {
        child = new RegExp(parent.source, __getRegExpFlags(parent))
        if (parent.lastIndex) child.lastIndex = parent.lastIndex
      } else if (clone.__isDate(parent)) {
        child = new Date(parent.getTime())
      } else if (useBuffer && Buffer.isBuffer(parent)) {
        child = new Buffer(parent.length)
        parent.copy(child)
        return child
      } else if (parent instanceof Error) {
        child = Object.create(parent)
      } else {
        if (typeof prototype === 'undefined') {
          proto = Object.getPrototypeOf(parent)
          child = Object.create(proto)
        } else {
          child = Object.create(prototype)
          proto = prototype
        }
      }

      if (circular) {
        let index = allParents.indexOf(parent)

        if (index !== -1) {
          return allChildren[index]
        }
        allParents.push(parent)
        allChildren.push(child)
      }

      if (parent instanceof NativeMap) {
        let keyIterator = parent.keys()
        while (true) {
          let next = keyIterator.next()
          if (next.done) {
            break
          }
          let keyChild = _clone(next.value, depth - 1)
          let valueChild = _clone(parent.get(next.value), depth - 1)
          child.set(keyChild, valueChild)
        }
      }
      if (parent instanceof NativeSet) {
        let iterator = parent.keys()
        while (true) {
          let next = iterator.next()
          if (next.done) {
            break
          }
          let entryChild = _clone(next.value, depth - 1)
          child.add(entryChild)
        }
      }

      for (let i in parent) {
        let attrs
        if (proto) {
          attrs = Object.getOwnPropertyDescriptor(proto, i)
        }

        if (attrs && attrs.set == null) {
          continue
        }
        child[i] = _clone(parent[i], depth - 1)
      }

      if (Object.getOwnPropertySymbols) {
        let symbols = Object.getOwnPropertySymbols(parent)
        for (let i = 0; i < symbols.length; i++) {
          // Don't need to worry about cloning a symbol because it is a primitive,
          // like a number or string.
          let symbol = symbols[i]
          let descriptor = Object.getOwnPropertyDescriptor(parent, symbol)
          if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
            continue
          }
          child[symbol] = _clone(parent[symbol], depth - 1)
          if (!descriptor.enumerable) {
            Object.defineProperty(child, symbol, {
              enumerable: false
            })
          }
        }
      }

      if (includeNonEnumerable) {
        let allPropertyNames = Object.getOwnPropertyNames(parent)
        for (let i = 0; i < allPropertyNames.length; i++) {
          let propertyName = allPropertyNames[i]
          let descriptor = Object.getOwnPropertyDescriptor(parent, propertyName)
          if (descriptor && descriptor.enumerable) {
            continue
          }
          child[propertyName] = _clone(parent[propertyName], depth - 1)
          Object.defineProperty(child, propertyName, {
            enumerable: false
          })
        }
      }

      return child
    }

    return _clone(parent, depth)
  }

  /**
  * Simple flat clone using prototype, accepts only objects, usefull for property
  * override on FLAT configuration object (no nested props).
  *
  * USE WITH CAUTION! This may not behave as you wish if you do not know how this
  * works.
  */
  clone.clonePrototype = function clonePrototype (parent) {
    if (parent === null) { return null }

    let C = function () {}
    C.prototype = parent
    return new C()
  }

  // private utility functions

  function __objToStr (o) {
    return Object.prototype.toString.call(o)
  }
  clone.__objToStr = __objToStr

  function __isDate (o) {
    return typeof o === 'object' && __objToStr(o) === '[object Date]'
  }
  clone.__isDate = __isDate

  function __isArray (o) {
    return typeof o === 'object' && __objToStr(o) === '[object Array]'
  }
  clone.__isArray = __isArray

  function __isRegExp (o) {
    return typeof o === 'object' && __objToStr(o) === '[object RegExp]'
  }
  clone.__isRegExp = __isRegExp

  function __getRegExpFlags (re) {
    let flags = ''
    if (re.global) flags += 'g'
    if (re.ignoreCase) flags += 'i'
    if (re.multiline) flags += 'm'
    return flags
  }
  clone.__getRegExpFlags = __getRegExpFlags

  return clone
})()
/*
 * Title Caps
 *
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 * Modified
**/
const titleCase = (function () {
  var small = '(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)'
  var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)"

  return function titleCase (title = '') {
    var parts = []
    var split = /[:.;?!] |(?: |^)["Ò]/g
    var index = 0

    while (true) {
      var m = split.exec(title)

      parts.push(title.substring(index, m ? m.index : title.length)
      .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (all) {
        return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all)
      })
      .replace(RegExp('\\b' + small + '\\b', 'ig'), lower)
      .replace(RegExp('^' + punct + small + '\\b', 'ig'), function (all, punct, word) {
        return punct + upper(word)
      })
      .replace(RegExp('\\b' + small + punct + '$', 'ig'), upper))

      index = split.lastIndex

      if (m) parts.push(m[0])
      else break
    }

    return parts.join('').replace(/ V(s?)\. /ig, ' v$1. ')
    .replace(/(['Õ])S\b/ig, '$1s')
    .replace(/\b(AT&T|Q&A)\b/ig, function (all) {
      return all.toUpperCase()
    })
  }

  function lower (word) {
    return word.toLowerCase()
  }

  function upper (word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1)
  }
})()
