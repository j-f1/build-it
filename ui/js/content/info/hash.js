import React from 'react'

import Copy from './copy'

export default ({ stats }) => {
  const hash = stats.hash
  const shortHash = hash.slice(0, 7)
  return <span>
    Hash: <Copy text={hash} />
    {' \u{2022} '}
    Short Hash: <Copy text={shortHash} />
  </span>
}
