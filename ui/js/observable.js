import cloneDeep from 'lodash.clonedeep'
const _ = {
  value: new WeakMap(),
  listeners: new WeakMap()
}
export default class Observable {
  /**
   * Value: any
   * listener: (Observable, oldVal, newVal)
   */
  constructor (value) {
    _.listeners.set(this, new Set())
    this.value = value // convenience
  }
  on (listener) {
    _.listeners.get(this).add(listener)
  }
  off (listener) {
    return _.listeners.get(this).remove(listener)
  }
  get value () {
    return cloneDeep(_.value.get(this))
  }
  set value (newVal) {
    const old = _.value.get(this)
    _.value.set(this, cloneDeep(newVal))
    _.listeners.get(this).forEach(listener => listener(this, old, newVal))
  }
  toString () {
    return `Observable <${this.value}>`
  }
}
