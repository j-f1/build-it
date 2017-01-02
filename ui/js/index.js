import { remote } from 'electron'
import ReactDOM from 'react-dom'
import moment from 'moment'
import React from 'react'

import { expand, shrink } from './resizer'
import WebpackHandler from './webpack'
import TitleBar from './title-bar'
import { fa } from './util'
import Task from './task'

class App extends React.Component {
  constructor (...args) {
    super(...args)
    this.toggleWindow = this.toggleWindow.bind(this)
    this.state = {
      stats: {compilation: {warnings: [], errors: []}},
      expanded: false
    }
  }
  componentDidMount () {
    this.webpack = new WebpackHandler({
      configPath: 'webpack.config.js'
    })
    this.webpack.init().then(() => this.webpack.start())
    this.webpack.task.on('change', (old, task) => {
      this.setState({task})
    })
    this.webpack.on('built', (err, stats) => {
      if (err) {
        console.error(err)
        return
      }
      this.setState({stats})
      const time = moment().calendar()
      setTimeout(() => {
        this.setState({
          task: new Task({
            label: [
              <span>
                Build <strong>
                  {stats.compilation.errors.length ? 'Failed' : 'Succeeded'}</strong>
              </span>,
              time],
            progress: 1
          })
        })
        process.nextTick(() => this.setState({task: null}))
      }, 400)
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
            count: this.state.stats.compilation.warnings.length,
            click () {
              console.warn('you’ve been warned!')
            }
          },
          errors: {
            count: this.state.stats.compilation.errors.length,
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
