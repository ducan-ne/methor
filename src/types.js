import { ServerResponse, ServerRequest } from 'http'

// @flow

export type Route = {
  method: string,
  path: string,
  handler: Function,
  children: [Route]
}

export type MethorOptions = {
  static: string,
  funcs?: { [key: string]: Function },
  methods: any,
  static?: string,
  services: { [key: string]: any },
  routes: Array<Route>,
  plugins?: Array<any>,
  created?: Function
} // string

export type HttpResponse = {
  ...ServerResponse,
  json(): void
}

export type HttpRequest = { ...ServerRequest }
