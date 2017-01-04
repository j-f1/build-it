import { remote } from 'electron'
import debounce from 'debounce'
import ReactDOM from 'react-dom'
import React from 'react'

import TitleBar, { TitleBarItem } from './title-bar'
import { fa, ctxt } from './util'
import { WebpackHandler } from './builders'
import { expand, shrink } from './resizer'
import Content from './content'

class App extends React.Component {
  constructor (...args) {
    super(...args)
    this.toggleWindow = this.toggleWindow.bind(this)
    this.state = {
      expanded: false,
      blurred: window.focusHandler.blurred
    }
    this._focus = () => this.setState({blurred: false})
    this._blur = () => this.setState({blurred: true})
    window.focusHandler.on('focus', this._focus).on('blur', this._blur)
  }
  getChildContext () {
    return {
      blurred: this.state.blurred
    }
  }
  componentWillUnmount () {
    window.focusHandler.off('focus', this._focus)
    window.focusHandler.off('blur', this._blur)
  }
  componentWillMount () {
    const webpack = new WebpackHandler({
      // from: 'ui/index.scss',
      // to: 'ui/index.css'
      configPath: 'webpack.config.js'
    })
    this.setState({
      webpack
    })
    webpack.init().then(() => webpack.start())
    webpack.task.on('change', debounce((old, task) => {
      this.setState({task})
    }, 25, true))
    webpack.on('built', (err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      this.setState({ stats, webpack: this.state.webpack })
      webpack.task.once('change', () => {
        process.nextTick(() => this.setState({
          task: null
        }))
      })
    })
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
    return <main>
      <TitleBar
        tasks={this.state.task ? [this.state.task] : []}
        issues={{
          warnings: {
            count: this.state.webpack.warnings.length,
            click () {
              console.warn('you’ve been warned!')
            }
          },
          errors: {
            count: this.state.webpack.errors.length,
            click () {
              console.error('Oh noes!')
            }
          }
        }}
        rightItems={<TitleBarItem onClick={this.toggleWindow}><i className={fa('caret-square-o-' + (this.state.expanded ? 'up' : 'down'), 'fa-lg')} /></TitleBarItem>}
      />
      <Content />
    </main>
  }
}
App.childContextTypes = ctxt('blurred')
window._tb = TitleBar
ReactDOM.render(
  <App />,
  document.querySelector('main')
)
