import React from 'react'
import ReactDOM from 'react-dom'
import TitleBar from './title-bar'
import Task from './task'
import WebpackHandler from './webpack'
import fs from 'fs'
import vm from 'vm'
import moment from 'moment'

class App extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      stats: {compilation: {warnings: [], errors: []}}
    }
  }
  componentDidMount () {
    const content = fs.readFileSync('webpack.config.js', 'utf-8')
    const config = vm.runInThisContext(content)
    this.webpack = new WebpackHandler({config})
    this.webpack.task.on((x, y, task) => {
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
      />
    </main>
  }
}
ReactDOM.render(
  <App />,
  document.querySelector('main')
)
import Observable from './observable'
window.WebpackHandler = WebpackHandler
window.Observable = Observable
