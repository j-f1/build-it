export default function proxy (ob, real, ...keys) {
  for (const key of keys) {
    ob[key] = real[key].bind(real)
  }
}
