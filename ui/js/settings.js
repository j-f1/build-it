import { createHash } from 'crypto'
import EventEmitter from 'events'

const hash = createHash('sha512')
hash.update(window.args.path)
const key = hash.digest('hex')

const extras = {
  commit (newSettings) {
    const oldSettings = settings
    settings = Object.assign({}, settings, newSettings, extras)
    window.localStorage.setItem(key, JSON.stringify(settings))
    settings.events.emit('change', oldSettings, settings)
  },
  defaults (defaults) {
    settings.commit(Object.assign({}, defaults, settings))
  },
  toJSON () {
    const json = Object.assign({}, this)
    delete json.events
    return json
  },
  events: new EventEmitter()
}

export let settings = {}
extras.commit(JSON.parse(window.localStorage.getItem(key) || '{}'))
