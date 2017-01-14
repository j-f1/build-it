const builderClasses = require('./builders')

exports.makeBuilder = function ({ name, opts, updateProgress = () => {}, setStats = () => {} }) {
  if (!builderClasses[name]) {
    throw new TypeError(`Builder class ${name} is not defined`)
  }
  const builder = new (builderClasses[name])(opts)
  builder.updateProgress = updateProgress
  builder.setStats = setStats
  return builder
}
