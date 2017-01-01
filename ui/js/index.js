import React from 'react'
import ReactDOM from 'react-dom'
import TitleBar from './title-bar'
import Task from './task'
import WebpackHandler from './webpack'
import fs from 'fs'
import vm from 'vm'
import moment from 'moment'
import { fa } from './util'
import { remote } from 'electron'
import { expand, shrink } from './resizer'

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
    const content = fs.readFileSync('webpack.config.js', 'utf-8')
    const config = vm.runInThisContext(content)
    this.webpack = new WebpackHandler({config})
    this.webpack.task.on('change', (x, y, task) => {
      this.setState({task})
    })
    this.webpack.compiler.watch({}, (err, stats) => {
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
