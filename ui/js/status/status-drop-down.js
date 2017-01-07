import React from 'react'
import ProgressBar from '../progress-bar'
import { st, vars } from '../util'

export default function StatusDropDown (props) {
  const styles = st({
    default: {
      container: {
        overflow: 'auto',
        position: 'absolute',
        left: 0,
        width: 'calc(100% - 2px)',
        margin: 0,
        padding: 0,
        marginTop: '0.15em',
        marginLeft: 1,

        background: 'white',
        borderRadius: 4,
        boxShadow: '0 0 1em rgba(0, 0, 0, 0.3)',
        listStyleType: 'none',
        transitionProperty: 'transform, box-shadow, opacity',
        transitionDuration: vars.duration,

        transformOrigin: 'center 0',
        transform: 'perspective(500px)'
      }
    },
    closed: {
      container: {
        /* 'translateY(-1.8em)', */
        transform: ['perspective(500px)', 'rotateX(-90deg)'].join(' '),
        boxShadow: 'none',
        opacity: 0,
        pointerEvents: 'none'
      }
    }
  }, {
    closed: !props.open
  })
  return <ul style={styles.container}>
    {props.tasks.map((task, i) => <StatusDropDownItem
      task={task}
      key={task.id}
      {...st.loop(i, props.tasks.length)}
    />)}
  </ul>
}
function StatusDropDownItem (props) {
  const { task } = props
  const styles = st({
    default: {
      container: {
        cursor: 'default',
        padding: '0.57em 0',
        paddingLeft: '2.5em',
        fontSize: '0.85em',
        borderBottom: '1px solid #DFDFDF'
      }
    },
    'last-child': {
      container: {
        borderBottom: 'none'
      }
    }
  }, props)
  return <li style={styles.container}>
    {task.labelJSX}
    <ProgressBar progress={task.progress} fat trackStyle={{
      float: 'right'
    }} />
  </li>
}
