import querystring from 'querystring'
import { remote } from 'electron'
import path from 'path'

import FA from 'react-fontawesome'
import ReactDOM from 'react-dom'
import React from 'react'

import TitleBar, { TitleBarItem } from './title-bar'
import { st, ctxt, debounceRAF } from './util'
import { WebpackHandler } from './builders'
import { expand, shrink } from './resizer'
import Content from './content'

class App extends React.Component {
  constructor (...args) {
    super(...args)
    this.toggleWindow = this.toggleWindow.bind(this)
    this.state = {
      expanded: false,
      blurred: window.focusHandler.blurred,
      env: 'dev'
    }
    this._focus = () => this.setState({blurred: false})
    this._blur = () => this.setState({blurred: true})

    this._updateTask = debounceRAF((old, task) => {
      this.setState({task})
    })
    this._built = this._built.bind(this)
    this._setEnv = this._setEnv.bind(this)

    window.focusHandler.on('focus', this._focus).on('blur', this._blur)
  }
  _setEnv (env) {
    this.setState({
      env
    })
    console.log(env)
    this.state.webpack.kill().then(() => this.state.webpack.init({
      env
    })).then(() => this.state.webpack.start()).catch(console.warn)
  }
  _built (err) {
    if (err) {
      console.error(err)
      return
    }
    this.setState({ webpack: this.state.webpack })
    this.state.webpack.task.once('change', (old, task) => {
      setTimeout(() => this.setState({
        task: null
      }), 100)
    })
  }
  getChildContext () {
    return {
      blurred: this.state.blurred,
      mini: !this.state.expanded
    }
  }
  componentWillMount () {
    const webpack = new WebpackHandler({
      // from: 'ui/index.scss',
      // to: 'ui/index.css'
      configPath: path.join(window.args.path, 'webpack.config.js')
    })
    this.setState({
      webpack
    })
  }
  componentDidMount () {
    const webpack = this.state.webpack
    webpack.init({
      env: this.state.env
    }).then(() => webpack.start())
    webpack.task.on('change', this._updateTask)
    webpack.on('built', this._built)
  }
  componentWillUnmount () {
    window.focusHandler.removeListener('focus', this._focus)
    window.focusHandler.removeListener('blur', this._blur)
    this.state.webpack.task.removeListener('change', this._updateTask)
    this.state.webpack.removeListener('built', this._built)
    this.state.webpack.kill()
  }
  toggleWindow () {
    this.setState(({ expanded }) => ({
      expanded: !expanded
    }))
    const w = remote.getCurrentWindow()
    if (!this.state.expanded) {
      document.documentElement.classList.remove('mini')
      expand(w)
    } else {
      document.documentElement.classList.add('mini')
      shrink(w)
    }
  }
  render () {
    const styles = st({
      default: {
        container: {
          display: 'flex',
          flexDirection: 'column',
          height: '100vh'
        }
      }
    }, this.state)
    return <main style={styles.container}>
      <TitleBar
        tasks={this.state.task ? [this.state.task] : []}
        issues={{
          warnings: {
            count: this.state.webpack.warnings.length,
            click: () => {
              if (!this.state.expanded) {
                this.toggleWindow()
              }
              ((this._content || {}).select || (x => x))('warnings')
            }
          },
          errors: {
            count: this.state.webpack.errors.length,
            click: () => {
              if (!this.state.expanded) {
                this.toggleWindow()
              }
              ((this._content || {}).select || (x => x))('errors')
            }
          }
        }}
        rightItems={<TitleBarItem onClick={this.toggleWindow} title={`${this.state.expanded ? 'Shrink' : 'Expand'} Window`}>
          <FA name={'caret-square-o-' + (this.state.expanded ? 'up' : 'down')} size='lg' />
        </TitleBarItem>}
      />
      <Content
        warnings={this.state.webpack.warnings}
        errors={this.state.webpack.errors}
        analyzer={this.state.webpack.opts.visualizerOutput}
        stats={this.state.webpack.stats}
        status={this.state.webpack}
        env={this.state.env}
        setEnv={this._setEnv}
        ref={ref => {
          this._content = ref
        }}
      />
    </main>
  }
}
App.childContextTypes = ctxt('blurred', 'mini')

window.args = querystring.parse(window.location.search.slice(1))
ReactDOM.render(
  <App />,
  document.querySelector('main')
)
