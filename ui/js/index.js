import React from 'react'
import ReactDOM from 'react-dom'
import TitleBar from './title-bar'
import Task from './task'

class App extends React.Component {
  constructor (...args) {
    super(...args)
    this._toggleTasks = this._toggleTasks.bind(this)
    this._fullTasks = [
      new Task({ label: <span>Building Update iOS: cocos2d-ios<span className='|' />Compiling 33 of 138 source files</span>, progress: 0.5 }),
      new Task({ label: <span>Indexing Text<span className='|' />Paused</span>, progress: 0.51 }),
      new Task({ label: <span>Indexing<span className='|' />Processing Files</span>, progress: 0.01 })
    ]
    this.state = {
      tasks: this._fullTasks.slice()
    }
  }
  _toggleTasks () {
    this.setState(({ tasks }) => ({
      tasks: tasks.length ? [] : this._fullTasks.slice()
    }))
  }
  render () {
    return <main>
      <TitleBar
        tasks={this.state.tasks}
        issues={{
          warnings: {
            count: 3,
            click () {
              console.warn('you’ve been warned!')
            }
          },
          errors: {
            count: 4,
            click () {
              console.error('Oh noes!')
            }
          },
          notices: {
            count: 2,
            click () {
              console.info('hi!')
            }
          }
        }}
        rightItems={<button onClick={this._toggleTasks}>Clicky</button>}
      />
    </main>
  }
}
ReactDOM.render(
  <App />,
  document.querySelector('main')
)
