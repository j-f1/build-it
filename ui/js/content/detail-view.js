import React from 'react'
import RequestShortener from 'webpack/lib/RequestShortener.js'
import Ansi from 'ansi-to-react'

const shortener = new RequestShortener(process.cwd())

function Text ({ children }) {
  return <pre style={{
    fontSize: '0.8em',
    background: 'black',
    padding: '0.5em',
    borderRadius: '0.25em',
    color: 'white',
    border: '1px solid #333',
    margin: '1em',
    marginLeft: 0
  }}><Ansi>{children}</Ansi></pre>
}

export default function DetailView ({ data, style }) {
  if (data.content) {
    return React.cloneElement(data.content, {style})
  }
  const items = {}
  data.items.forEach((item) => {
    const key = item.origin.readableIdentifier(shortener)
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
