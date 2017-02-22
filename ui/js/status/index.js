import React from 'react'

import StatusDropDown from './status-drop-down'
import { TitleBarItem } from '../title-bar'
import ProgressBar from '../progress-bar'
import Indicator from './indicator'
import Issues from './issues'
import { st } from '../util'

const _ = {
  toggleDropDown: Symbol('toggle dropdown'),
  renderIssues: Symbol('render issues'),
  renderTasks: Symbol('render tasks')
}

export default class Status extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      dropDownOpened: false,
      lastTask: null,
      lastLength: 0
    }
    this[_.toggleDropDown] = this[_.toggleDropDown].bind(this)
  }
  [_.toggleDropDown] () {
    this.setState(({ dropDownOpened }) => ({
      dropDownOpened: !dropDownOpened
    }))
  }
  componentWillReceiveProps (newProps) {
    if (!newProps.tasks.length && this.props.tasks[0]) {
      this.setState({
        lastLength: this.props.tasks.length,
        lastTask: this.props.tasks[0]
      })
    }
  }
  render () {
    const { tasks } = this.props
    const styles = st({
      default: {
        container: {
          position: 'relative',
          margin: '0 7px',
          flex: 1,
          maxWidth: 'calc(100vw - 100px)',
          minWidth: 0
        },
        item: {
          transform: 'translate3d(0, 0, 0)', // stop the corner of the progress bar from breaking out when fading.
          // @media screen and (min-resolution: 2dppx) {
          //   width: 1024px;
          // }
          margin: '0 auto',
          maxWidth: 512,
          display: 'flex',
          alignItems: 'center',
          padding: '3px 8px',
          fontSize: '0.865em',
          position: 'relative',
          overflow: 'auto'
        },
        statusText: {
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }
      }
    })
    return <div style={styles.container}>
      <TitleBarItem button={false} component='section' style={styles.item}>
        <Indicator
          count={tasks.length || this.state.lastLength}
          hidden={tasks.length < 2}
          onClick={this[_.toggleDropDown]}
        />
        <span style={styles.statusText}>
          {(tasks[0] || this.state.lastTask || {}).labelJSX}
        </span>
        <Issues issues={this.props.issues} />
        <ProgressBar
          progress={(tasks[0] || this.state.lastTask || {progress: 0}).progress}
          visible={!!this.props.tasks.length}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 2
          }} />
      </TitleBarItem>
      {tasks.length > 1 && <StatusDropDown
        open={this.state.dropDownOpened}
        tasks={this.props.tasks.slice(1)}
      />}
    </div>
  }
}

Status.defaultProps = {
  tasks: [],
  issues: {}
}
Status.propTypes = {
  tasks: React.propTypes.array,
  issues: React.propTypes.object
}
