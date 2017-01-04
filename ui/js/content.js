import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { fa, st, ctxt } from './util'

Tabs.setUseDefaultStyles(false)

export default class Content extends React.Component {
  constructor (...args) {
    super(...args)
    this._select = this._select.bind(this)
    this.state = {
      tab: 0
    }
  }
  _select (tab) {
    this.setState({ tab })
  }
  render () {
    const styles = st({
      default: {
        tabBar: {
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          height: 24,
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderBottomColor: 'hsl(0, 0%, 65%)',
          backgroundImage: 'linear-gradient(to bottom, hsl(0, 0%, 78%), hsl(0, 0%, 72%))',
          backgroundColor: 'transparent',
          backgroundSize: '100% 200%'
        },
        tab: {
          cursor: 'default',
          color: 'rgba(0, 0, 0, 0.55)',

          display: 'flex',
          flex: '1',
          position: 'relative',
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 6px',
          minWidth: 24,
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(to bottom, hsl(0, 0%, 78%), hsl(0, 0%, 72%))',
          backgroundSize: '100% 200%',
          // borderTop: '1px solid',
          // borderTopColor: 'hsl(0, 0%, 65%)',
          height: '100%',
          lineHeight: '15px',
          outline: 'none',
          backgroundPosition: '0 100%',
          borderTopColor: 'hsl(0, 0%, 59%)',
          borderLeftColor: 'hsl(0, 0%, 59%)'
        },
        activeTab: {
          borderTopColor: 'hsl(0, 0%, 74%)',
          backgroundImage: 'linear-gradient(to bottom, hsl(0, 0%, 87%), hsl(0, 0%, 82%))',
          backgroundSize: '100% 100%'
        }
      },
      blurred: {
        tabBar: {
          borderBottomColor: 'hsl(0, 0%, 85%)',
          backgroundImage: 'none',
          backgroundColor: 'hsl(0, 0%, 92%)'
        },
        tab: {
          borderLeftColor: 'hsl(0, 0%, 85%)',
          borderTopColor: 'hsl(0, 0%, 85%)',

          backgroundImage: 'none',
          backgroundColor: 'hsl(0, 0%, 92%)'
        },
        activeTab: {
          backgroundImage: 'none',
          backgroundColor: 'hsl(0, 0%, 96%)'
        }
      }
    }, this.context)
    const tabTitles = [
      <span><i className={fa('warning')} /> 3</span>,
      <span><i className={fa('exclamation-circle')} /> 2</span>
    ]
    return <Tabs selectedIndex={this.state.tab} onSelect={this._select}>
      <TabList style={styles.tabBar}>
        {tabTitles.map((title, i) =>
          <Tab
            style={Object.assign({}, styles.tab, (i === this.state.tab) && styles.activeTab)}
            >
              {title}
            </Tab>
          )
        }
      </TabList>
      <TabPanel>
        <h1><strong>3</strong> Warnings</h1>
      </TabPanel>
      <TabPanel>
        <h1><strong>2</strong> Errors</h1>
      </TabPanel>
    </Tabs>
  }
}
Content.contextTypes = ctxt('blurred')
