import React from 'react'

export default function DetailView ({ data }) {
  return data.content || <ul>{data.items.map((item, i) => <li key={i}><pre>{item.message}</pre></li>)}</ul>
}
