import got from 'got'

export default function request(
  instance,
  methodName,
  query,
  method = 'get',
  opts
) {
  const _opts = Object.assign(
    {
      path: methodName[0] === '/' ? methodName : '/restserver',
      port: instance.$options.port || instance.port,
      query: Object.assign({}, { method: methodName }, query)
    },
    opts
  )
  return got[method]('http://0.0.0.0', _opts).then(res => {
    try {
      res.body = JSON.parse(res.body)
    } catch (err) {}
    return res
  })
}
