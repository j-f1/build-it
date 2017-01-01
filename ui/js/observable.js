import cloneDeep from 'lodash.clonedeep'
import EventEmitter from 'events'

const _value = new WeakMap()

export default class Observable extends EventEmitter {
  /**
   * Value: any
   * listener: (oldVal, newVal)
   */
  constructor (value) {
    super()
    this.value = value // convenience
  }
  off (...args) {
    this.removeListener(...args)
  }
  get value () {
    return cloneDeep(_value.get(this))
  }
  set value (newVal) {
    const old = _value.get(this)
    _value.set(this, cloneDeep(newVal))
    this.emit('change', old, newVal)
  }
  toString () {
    return `Observable <${this.value}>`
  }
}
