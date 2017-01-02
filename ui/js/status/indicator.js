import React from 'react'
import { st, vars } from '../util'

const Indicator = st.handleActive(_Indicator)
export default Indicator

function _Indicator (props) {
  const styles = st({
    default: {
      container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8em',
        marginLeft: '-0.4em',
        marginRight: '1em',
        height: '0.75rem',
        width: '0.75rem',
        background: '#949494',
        color: 'white',
        borderRadius: '50%',
        transition: [
          `width ${vars.indicatorDuration}, margin ${vars.indicatorDuration}`,
          `transform ${vars.indicatorDuration} ${vars.indicatorDuration}`,
          `color ${vars.doubleIndicatorDuration} ${vars.doubleIndicatorDuration}`
        ].join(', '),
        transform: 'none'
      }
    },
    'active': {
      container: {
        background: '#636363'
      }
    },
    'hidden': {
      container: {
        transform: 'scale(0)',
        color: 'transparent',
        width: 0,
        margin: 0,
        transition: [
          `color ${vars.indicatorDuration}`,
          `transform ${vars.indicatorDuration} ${vars.indicatorDuration}`,
          `width ${vars.doubleIndicatorDuration} ${vars.doubleIndicatorDuration}`,
          `margin ${vars.doubleIndicatorDuration} ${vars.doubleIndicatorDuration}`
        ].join(', ')
      }
    }
  }, props)
  return <div
    style={styles.container}
    onClick={props.onClick}>
    {props.count}
  </div>
}
