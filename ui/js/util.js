import { classJoin } from 'css-classname'

export const cx = classJoin
export function fa (icon, ...args) {
  return cx('fa', `fa-${icon}`, ...args)
}
