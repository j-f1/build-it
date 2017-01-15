import React from 'react'

import { st } from '../../util'

import { formatModules } from './util'

const TreeItem = ({ item }) => {
  const styles = st({
    default: {
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
    }
  })
  return <li>
    <span style={styles.label}>
      <code>{item.name}</code>
      <span style={styles.meta}>({item.size}) <span style={styles.percent}>{(+item.percentage / 100).toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
      })}</span></span>
    </span>
    {!!item.children.length && <ul>
      {item.children.map(item => <TreeItem key={item.name} item={item} />)}
    </ul>}
  </li>
}

export default ({ stats }) => {
  const trees = formatModules(stats)
  return <section>
    {trees.map((tree, i) => <ul key={i}>
      {tree.map(item => <TreeItem key={item.name} item={item} />)}
    </ul>)}
  </section>
}
