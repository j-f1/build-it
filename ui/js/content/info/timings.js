import React from 'react'

import { toTimeString } from '../../util'

export default ({ stats }) => <span>
  Compilation took{' '}
  <strong>{toTimeString(stats.time / 1000)}</strong>
</span>
