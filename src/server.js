/** REQUIRES */

/** CommonJS => require */
//const http = require('node:http')

/** ESModules => import/export */
import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

/**
 * STATUS CODE
 * 100 - 199 [INFORMATIONAL]
 * 200 - 299 [SUCCESSFUL]
 * 300 - 399 [REDIRECTION]
 * 400 - 499 [CLIENT ERROR]
 * 500 - 599 [SERVER ERROR]
 * HTTP RESPONSES MDN
 */
const server = http.createServer(async (request, response) => {

  /**
   * INFORMATIONS FROM REQUEST
   * QUERY PARAMETERS (URL)
   * ROUTE PARAMETERS (URL)
   * REQUEST BODY
   */
  const { method, url } = request

  /** MIDDLEWARE */
  await json(request,response)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  //console.log(route)

  if(route) {
    const routeParams = request.url.match(route.path)
    //console.log(routeParams)

    request.params = { ...routeParams.groups}

    //console.log(params)

    return route.handler(request,response)
  }

  return response.writeHead(404).end("Not found")
})

server.listen(3333)
