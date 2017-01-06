import React from 'react'
import { st, vars, fa } from '../util'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { sineInOut } from 'eases'

const icons = {
  warnings: 'warning',
  errors: 'exclamation-circle',
  notices: 'info-circle'
}

export default function Issues (props) {
  const { issues } = props
  const styles = st({
    default: {
      container: {
        margin: '-8px -3px',
        marginLeft: 0,
        fontSize: '0.85em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      },
      item: {
        display: 'flex',
        alignItems: 'center'
      }
    }
  })
  return <TransitionGroup style={styles.container}>{Object.keys(issues).map(key => (issues[key].count === 0 || issues[key] === 0) ? null : <Issue key={key} issue={issues[key]} type={key} style={styles.item} />)}</TransitionGroup>
}

function animate (from, to, duration, cb) {
  // cb(current, done)
  const startTime = window.performance.now()
  const diff = to - from
  function _doWork () {
    const dt = window.performance.now() - startTime
    const current = from + diff * dt / duration
    if (diff > 0
      ? current < to
      : current > to) {
      cb(current, false)
      window.requestAnimationFrame(_doWork)
    } else {
      cb(1, true)
    }
  }
  _doWork()
}

class Issue extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = {
      progress: 0
    }
  }
  componentWillAppear (cb) {
    this.setState({ progress: 1 })
  }
  componentWillEnter (cb) {
    this._animateTo(1, cb)
  }
  componentWillLeave (cb) {
    this._animateTo(0, cb)
  }
  _animateTo (dest, cb, duration = 400) {
    animate(this.state.progress, dest, duration, (progress, done) => {
      this.setState({ progress })
      if (done && cb) {
        cb()
      }
    })
  }
  _animStyle () {
    const progress = sineInOut(this.state.progress)
    return {
      opacity: Math.max(2 * (progress - 0.5), 0),
      width: this._el ? this._el.getBoundingClientRect().width * progress : 'auto'
    }
  }
  render () {
    const { style, ...rest } = this.props
    return <_IssueContent {...rest} style={Object.assign({}, style, this._animStyle())} ref_={el => { this._el = el }} />
  }
}

const _IssueContent = st.handleActive((props) => {
  const { issue } = props
  const styles = st({
    default: {
      icon: {
        transition: 'color 0.15s',
        fontSize: '1.25em',
        marginTop: 1,
        marginLeft: 8,
        marginRight: 4
      }
    },
    active: {
      icon: {
        transition: 'none',
        filter: 'brightness(50%)' // see if this works good.
      }
    },

    notices: {
      icon: {
        color: vars.notice,
        fontSize: '1.5em',
        marginRight: 2,
        marginTop: 0
      }
    },
    warnings: {
      icon: {
        color: vars.warning
      }
    },
    errors: {
      icon: {
        color: vars.error,
        fontSize: '1.5em',
        marginRight: 2,
        marginTop: 0
      }
    }
  }, { active: props.active }, props.type)
  return <span style={props.style}><a onClick={issue.click} ref={props.ref_}>
    <i style={styles.icon} className={fa(issue.icon || icons[props.type] || props.type)} />
    {' ' + (typeof issue.count === 'number' ? issue.count : issue)}
  </a></span>
})
