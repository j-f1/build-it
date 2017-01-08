import Builder from './util/builder'

export default class SASSHandler extends Builder {
  constructor (opts) {
    super(opts, {
      from: undefined,
      to: undefined,
      args: [],
      label: 'SASS'
    })
    this._status = {
      ok: undefined,
      warnings: [],
      errors: []
    }
  }
  get warnings () {
    return this._main.warnings
  }
  get errors () {
    return this._main.errors
  }
}
