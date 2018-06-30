export default (typeof setImmediate === 'function'
  ? setImmediate
  : function(fn) {
      process.nextTick(fn.bind.apply(fn, arguments))
    })
