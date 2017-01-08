import React from 'react'
import ansiStyle from 'react-ansi-style'
import 'react-ansi-style/inject-css'

function Text ({ children, highlight = true }) {
  let content
  if (highlight instanceof String || typeof highlight === 'function') {
    const Highlight = highlight
    content = <Highlight>{children}</Highlight>
  } else if (highlight) {
    content = <code>{ansiStyle(React, children)}</code>
  } else {
    content = <code>{children}</code>
  }
  return <pre style={{
    fontSize: '0.8em',
    background: 'black',
    padding: '0.5em',
    borderRadius: '0.25em',
    color: 'white',
    border: '1px solid #333',
    overflow: 'auto',
    margin: '1em',
    marginLeft: 0
  }}>{content}</pre>
}

export default function DetailView ({ data, style }) {
  if (data.content) {
    return React.cloneElement(data.content, {style})
  }
  const items = {}
  data.items.forEach((item) => {
    const key = item.loc
    items[key] = (items[key] || []).concat(item.message.trim())
  })
  return <ul style={Object.assign({WebkitUserSelect: 'initial'}, style)}>
    {Object.keys(items).map((name, i) => <li key={i}>
      <strong>{name}</strong>
      {items[name].length > 1
        ? <ul>{items[name].map((msg, j) => <li key={j}><Text>{msg}</Text></li>)}</ul>
        : <Text>{items[name][0]}</Text>
      }
    </li>)}
  </ul>
}
