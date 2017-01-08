import Builder from './util/builder'

export default class WebpackHandler extends Builder {
  constructor (opts) {
    super(opts, {
      configPath: null,
      label: 'webpack'
    })
  }
  get notices () {
    return this._main.notices
  }
  get warnings () {
    return this._main.warnings
  }
  get errors () {
    return this._main.errors
  }
}
