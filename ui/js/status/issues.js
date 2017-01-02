import React from 'react'
import { st, vars, fa } from '../util'

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
  return <div style={styles.container}>{Object.keys(issues).map(key => <Issue key={key} issue={issues[key]} type={key} style={styles.item} />)}</div>
}

const Issue = st.handleActive((props) => {
  const { issue } = props
  if (issue.count === 0 || issue === 0) {
    return null
  }
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
        color: vars.accent,
        fontSize: '1.5em',
        marginRight: 2,
        marginTop: 0
      }
    },
    warnings: {
      icon: {
        color: '#FFC501'
      }
    },
    errors: {
      icon: {
        color: '#E21414',
        fontSize: '1.5em',
        marginRight: 2,
        marginTop: 0
      }
    }
  }, { active: props.active }, props.type)
  return <a onClick={issue.click} style={props.style}>
    <i style={styles.icon} className={fa(issue.icon || icons[props.type] || props.type)} />
    {' ' + (typeof issue.count === 'number' ? issue.count : issue)}
  </a>
})
