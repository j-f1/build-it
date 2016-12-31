import React from 'react'
import Status from './status'

export default class TitleBar extends React.Component {
  render () {
    return <header>
      {this.props.leftItems}
      <Status tasks={this.props.tasks} issues={this.props.issues} />
      {this.props.rightItems}
    </header>
  }
}
