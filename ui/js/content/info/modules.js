import React from 'react'

import { st } from '../../util'

import { formatModules } from './util'

const TreeItem = (props) => {
  const { item } = props
  const styles = st({
    default: {
      container: {
        background: 'white'
      },
      label: {
        display: 'inline-flex',
        width: '100%'
      },
      meta: {
        flex: 1,
        textAlign: 'right'
      },
      percent: {
        display: 'inline-block',
        width: '7ch'
      }
    },
    even: {
      container: {
        background: '#f0f0f0'
      }
    }
  }, props)
  return <li style={styles.container}>
    <span style={styles.label}>
      <code>{item.name}</code>
      <span style={styles.meta}>({item.size}) <span style={styles.percent}>{(+item.percentage / 100).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
      })}</span></span>
    </span>
    {!!item.children.length && <ul>
      {item.children.map((item, i) => <TreeItem key={item.name} item={item} {...st.loop(props.even + i, props.even + item.children.length)} />)}
    </ul>}
  </li>
}

export default ({ stats }) => {
  const trees = formatModules(stats)
  return <section>
    {trees.map((tree, key) => <ul key={key}>
      {tree.map((item, i) => <TreeItem key={item.name} item={item} {...st.loop(i, tree.length)} />)}
    </ul>)}
  </section>
}
