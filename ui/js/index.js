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

const EXPANDED_SIZE = {w: 700, h: 500}
const SMALL_SIZE = {w: 400, h: 36}

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
  toggleWindow () {
    this.setState(({ expanded }) => ({
      expanded: !expanded
    }))
    const w = remote.getCurrentWindow()
    if (!this.state.expanded) {
      // expand!
      document.documentElement.classList.remove('mini')
      const bounds = w.getBounds()
      if ((bounds.x + EXPANDED_SIZE.w) > window.screen.width) {
        w.setBounds({
          x: bounds.x + window.screen.width - (bounds.x + EXPANDED_SIZE.w),
          y: bounds.y,
          width: EXPANDED_SIZE.w,
          height: EXPANDED_SIZE.h
        }, true)
      } else {
        w.setSize(EXPANDED_SIZE.w, EXPANDED_SIZE.h, true)
      }
      w.setResizable(true)
    } else {
      // shrink!
      document.documentElement.classList.add('mini')
      w.setSize(SMALL_SIZE.w, SMALL_SIZE.h, true)
      w.setResizable(false)
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
