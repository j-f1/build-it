import { ipcRenderer } from 'electron'

export function expand () {
  ipcRenderer.send('resizer-expand')
}
export function shrink () {
  ipcRenderer.send('resizer-shrink')
}
