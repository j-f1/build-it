import path from 'path'

import filesize from 'pretty-bytes'

// from https://github.com/FormidableLabs/webpack-dashboard/blob/451b5e375184486ad06da501fce4eb5d124e892c/utils/format-modules.js
// Modified

export function formatModules (stats) {
  let trees
  if (!stats.hasOwnProperty('modules')) {
    trees = stats.children.map(makeTree)
  } else {
    trees = [makeTree(stats)]
  }
  return trees.map(parseTree)
}

function getPosition (string, needle, i) {
  return string.split(needle, i).join(needle).length
}

function modulePath (identifier) {
  let loaderRegex = /.*!/
  return identifier.replace(loaderRegex, '')
}

function moduleDirPath (modulePath) {
  let moduleDirRegex = new RegExp('(.*?node_modules\\' + path.sep + '.*?)\\' + path.sep)
  return modulePath.match(moduleDirRegex)[1]
}

function makeTree (stats) {
  let statsTree = {
    packageName: '<root>',
    packageVersion: '',
    size: 0,
    children: []
  }

  if (stats.name) {
    statsTree.bundleName = stats.name
  }

  let modules = stats.modules.map(mod => ({
    path: modulePath(mod.identifier),
    size: mod.size
  }))

  modules.sort((a, b) => {
    if (a === b) {
      return 0
    } else {
      return a < b ? -1 : 1
    }
  })

  modules.forEach(mod => {
    let packages = mod.path.split(new RegExp('\\' + path.sep + 'node_modules\\' + path.sep))
    // let filename
    if (packages.length > 1) {
      let lastSegment = packages.pop()

      let lastPackageName = ''
      if (lastSegment.indexOf('@')) {
        lastPackageName = lastSegment.slice(0, lastSegment.search(new RegExp('\\' + path.sep + '|$')))
      } else {
        lastPackageName = lastSegment.slice(0, getPosition(lastSegment, path.sep, 2))
      }

      packages.push(lastPackageName)
      // filename = lastSegment.slice(lastPackageName.length + 1)
    } else {
      // filename = packages[0]
    }
    packages.shift()

    let parent = statsTree
    parent.size += mod.size
    packages.forEach(pkg => {
      let existing = parent.children.filter(child => child.packageName === pkg)
      let packageVersion = ''
      if (existing.length > 0) {
        existing[0].size += mod.size
        parent = existing[0]
      } else {
        try {
          // fix webpack screaming at me. Use the Node require instead.
          packageVersion = global.require(path.join(moduleDirPath(mod.path), 'package.json')).version
        } catch (err) {
          packageVersion = ''
        }
        let newChild = {
          packageName: pkg,
          packageVersion: packageVersion,
          size: mod.size,
          children: []
        }
        parent.children.push(newChild)
        parent = newChild
      }
    })
  })

  return statsTree
}

const _initial = {}

function parseTree (node, initial = _initial) {
  // initial is set by `map()`.
  const output = []
  let childrenBySize = node.children.sort((a, b) => b.size - a.size)

  let totalSize = node.size
  let remainder = totalSize
  // let includedCount = 0

  // let prefix = ''
  // for (let i = 0; i < depth; i++) {
  //   prefix += '  '
  // }

  for (let child of childrenBySize) {
    // ++includedCount
    let percentage = ((child.size / totalSize) * 100).toPrecision(3)
    output.push({
      name: child.packageName + '@' + child.packageVersion,
      size: filesize(child.size),
      percentage,
      children: parseTree(child)
    })

    remainder -= child.size

    if (remainder < 0.01 * totalSize) {
      break
    }
  }

  if (initial !== _initial || remainder !== totalSize) {
    let percentage = ((remainder / totalSize) * 100).toPrecision(3)
    output.push({
      name: '<self>',
      size: filesize(remainder),
      percentage,
      children: []
    })
  }
  return output
}
