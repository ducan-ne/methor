import Methor from '../../lib/methor'

export default function(opts) {
  return new Promise(resolve => {
    let defaultOpts = {
      port: null,
      methods: {},
      created(port) {
        resolve(instance)
      }
    }
    let instance = new Methor(Object.assign({}, defaultOpts, opts))
  })
}
