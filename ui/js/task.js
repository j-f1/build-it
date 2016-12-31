import uuid from 'uuid'
export default class Task {
  constructor ({ label, progress, percent, ...rest }) {
    this.label = label
    this.progress = progress || percent / 100
    this.opts = rest
    this.id = uuid()
  }
  get percent () {
    return this.progress * 100
  }
  set percent (percent) {
    this.progress = percent / 100
  }
}
