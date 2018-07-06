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
      json: true,
      port: instance.$options.port || instance.port,
      query: Object.assign({}, { method: methodName }, query)
    },
    opts
  )
  return got[method]('http://0.0.0.0', _opts)
}
