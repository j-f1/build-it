import React from 'react'
import { cx, fa } from './util'
import ProgressBar from './progress-bar'

const _ = {
  toggleDropDown: Symbol('toggle dropdown'),
  renderIssues: Symbol('render issues'),
  renderTasks: Symbol('render tasks')
}

const icons = {
  warnings: 'warning',
  errors: 'exclamation-circle',
  notices: 'info-circle'
}

export default class Status extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      dropDownOpened: false,
      lastTask: null,
      lastCount: 0
    }
    this[_.toggleDropDown] = this[_.toggleDropDown].bind(this)
  }
  [_.toggleDropDown] () {
    this.setState(({ dropDownOpened }) => ({
      dropDownOpened: !dropDownOpened
    }))
  }
  [_.renderIssues] () {
    const { issues } = this.props
    return Object.keys(issues).map(key => <a key={key} className={cx(key)} onClick={issues[key].click}>
      <i className={fa(issues[key].icon || icons[key] || key)} />
      {' ' + (issues[key].count || issues[key])}
    </a>)
  }
  [_.renderDropDown] () {
    return this.props.tasks.slice(1).map(task => <li key={task.id}>
      {task.label}
      <ProgressBar progress={task.progress} />
    </li>)
  }
  componentWillReceiveProps (newProps) {
    if (!newProps.tasks.length && this.props.tasks[0]) {
      this.setState({
        lastCount: this.props.tasks.count,
        lastTask: this.props.tasks[0]
      })
    }
  }
  render () {
    const { tasks } = this.props
    return <div>
      <section>
        <span
          className={cx('indicator', {
            hidden: tasks.length < 2
          })}
          onClick={this[_.toggleDropDown]}>
          {tasks.length || this.state.lastCount}
        </span>
        <span className='status'>
          {(tasks[0] || this.state.lastTask).label}
        </span>
        <span className='issues'>
          {this[_.renderIssues]()}
        </span>
        <ProgressBar
          progress={(tasks[0] || this.state.lastTask || {progress: 0}).progress}
          visible={!!this.props.tasks.length} />
      </section>
      {tasks.length > 1 && <ul
        className={cx('dropdown', {active: this.state.dropDownOpened})}>
        {this[_.renderDropDown]()}
      </ul>}
    </div>
  }
}

Status.defaultProps = {
  tasks: [],
  issues: {}
}
