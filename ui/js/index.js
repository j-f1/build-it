import { remote } from 'electron'
import ReactDOM from 'react-dom'
import React from 'react'

import TitleBar, { TitleBarItem } from './title-bar'
import { fa, st, ctxt, debounceRAF } from './util'
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
      blurred: this.state.blurred,
      mini: !this.state.expanded
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
  }
  componentDidMount () {
    const webpack = this.state.webpack
    webpack.init().then(() => webpack.start())
    webpack.task.on('change', debounceRAF((old, task) => {
      this.setState({task})
    }))
    webpack.on('built', (err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      this.setState({ stats, webpack: this.state.webpack })
      webpack.task.once('change', (old, task) => {
        setTimeout(() => this.setState({
          task: null
        }), 100)
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
        rightItems={<TitleBarItem onClick={this.toggleWindow} title={`${this.state.expanded ? 'Shrink' : 'Expand'} Window`}><i className={fa('caret-square-o-' + (this.state.expanded ? 'up' : 'down'), 'fa-lg')} /></TitleBarItem>}
      />
      <Content
        warnings={this.state.webpack.warnings}
        errors={this.state.webpack.errors}
        analyzer={this.state.webpack._main.opts.visualizerOutput}
        ref={ref => {
          this._content = ref
        }}
      />
    </main>
  }
}
App.childContextTypes = ctxt('blurred', 'mini')
window._tb = TitleBar
ReactDOM.render(
  <App />,
  document.querySelector('main')
)
