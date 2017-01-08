const builderClasses = require('./builders')

exports.makeBuilder = function ({ name, opts, updateProgress }) {
  if (!builderClasses[name]) {
    throw new TypeError(`Builder class ${name} is not defined`)
  }
  const builder = new (builderClasses[name])(opts)
  builder.updateProgress = updateProgress
  return builder
}
