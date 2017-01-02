import { remote } from 'electron'
import ReactDOM from 'react-dom'
import React from 'react'

import { expand, shrink } from './resizer'
import { WebpackHandler } from './builders'
import TitleBar from './title-bar'
import { fa } from './util'

class App extends React.Component {
  constructor (...args) {
    super(...args)
    this.toggleWindow = this.toggleWindow.bind(this)
    this.state = {
      expanded: false
    }
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
    webpack.task.on('change', (old, task) => {
      this.setState({task})
    })
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
        rightItems={<button onClick={this.toggleWindow}><i className={fa('caret-square-o-' + (this.state.expanded ? 'up' : 'down'), 'fa-lg')} /></button>}
      />
    </main>
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('main')
)
