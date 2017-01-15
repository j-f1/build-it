import size from 'pretty-bytes'
import React from 'react'

import { st, vars } from '../../util'

const Big = props => {
  const styles = st({
    default: {
      big: {
        color: 'white',
        background: vars.warning,
        borderRadius: '0.25em',
        display: 'inline-flex',
        width: '2.15em',
        height: '1.25em',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }
  }, props)
  return <span style={styles.big} title={props.title || 'This asset is bigger than the recommended size limit.'}>big</span>
}

function Asset ({ asset }) {
  return <span>
    <code>{asset.name}</code> {asset.isOverSizeLimit && <Big />}
    {' '}({size(asset.size)})
  </span>
}

export default ({ stats }) => <div>
  <ul>
    {stats.assets.map(asset => <li key={asset.name}>
      <Asset asset={asset} />
    </li>)}
  </ul>
  <span><em>Total</em>: {size(stats.assets.map(asset => asset.size).reduce((x, y) => x + y))}</span>
</div>
