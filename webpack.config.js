const webpack = require('webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const DashboardPlugin = require('webpack-dashboard/plugin')
const BabiliPlugin = require('babili-webpack-plugin')

const minify = new BabiliPlugin()

const prodPlugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  minify
]
const devPlugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: false,
    debug: true
  }),
  new DashboardPlugin()
]

const getExternals = (modules) => {
  const ob = {}
  modules.forEach(name => {
    ob[name] = `require("${name.replace('"', '\\"')}")`
  })
  delete ob['normalize.css']
  delete ob['opinionate.css']
  return ob
}

const normalizeEnv = (env) => {
  env = (process.env.NODE_ENV || env || 'development').toLowerCase()
  if (normalizeEnv.shortcuts[env]) {
    return normalizeEnv.shortcuts[env]
  }
  return env
}
normalizeEnv.shortcuts = {
  dev: 'development',
  prod: 'production'
}

module.exports = (envArg) => {
  const env = normalizeEnv(envArg)
  const dev = env === 'development'
  const prod = env === 'production'
  console.log('Environment: \u001b[1m' + env + '\u001b[22m')

  let pkg

  try {
    pkg = require('./package')
  } catch (e) {
    pkg = require('../package')
  }

  const externals = getExternals(Object.keys(pkg.dependencies))

  const conf = {
    target: 'electron',
    entry: ['babel-polyfill', 'normalize.css', 'opinionate.css', './ui/js/index.js'],
    output: {
      filename: './ui/index.js'
    },
    externals,
    module: {
      rules: [
        {
          test: /ui\/js\/(.*)\.jsx?$/,
          enforce: 'pre',
          loader: 'standard-loader'
        },
        {
          test: /ui\/js\/(.*)\.jsx?$/,
          loader: 'babel-loader',
          query: {
            presets: [
              ['env', {
                targets: {
                  electron: /^.+(\d+\.\d+)\..*$/.exec(pkg.devDependencies.electron)[1]
                },
                modules: false
              }],
              'react',
              'stage-1'
            ],
            cacheDirectory: true
          }
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.jsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': `(${JSON.stringify({
          NODE_ENV: JSON.stringify(env)
        })})`
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        logLevel: 'warn'
      }),
      ...(prod ? prodPlugins : []),
      ...(dev ? devPlugins : [])
    ],
    performance: {
      maxEntrypointSize: 500e3,
      maxAssetSize: 300e3
    }
  }
  switch (env) {
    case 'development':
      conf.devtool = 'source-map'
      break
    case 'production':
      break
    default:
      break
  }
  return conf
}
