const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.development')
})
console.log('Current directory:', process.cwd())

console.log('Starting', process.env.NODE_ENV, process.env.MYSQL_HOST)
const next = require('next')
var http = require('http')
var express = require('express')
// var cookieParser = require('cookie-parser')
// var logger = require('morgan')
var cors = require('cors')
var debug = require('debug')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const Routes = require('./routes/index') // 导入路由模块
console.log('Routes', Routes)

var httpServer

/*
 * 在结合 Express 和 Next.js 时，app.prepare() 方法确保 Next.js 完全准备好并可以处理来自 Express 服务器的请求。
 */
app.prepare().then(() => {
  const server = express()
  server.use(cors())
  // app.use(logger('dev'))
  // app.use(cookieParser())
  server.use(express.json()) // 将 JSON HTTP 请求体解析为 JavaScript 对象
  server.use(express.urlencoded({ extended: false })) // 用于url编码的请求题，针对于'Content-Type': 'application/x-www-form-urlencoded'的post请求
  server.use(express.static(path.join(__dirname, 'public'))) //获取静态文件夹路径

  // Example custom API route
  Routes.routeLists.forEach((v) => {
    console.log(`/api/${v}`, `${v}Routes`)
    server.use(`/api/${v}`, Routes.routes[`${v}Routes`])
  })
  // Default next.js handler for all other routes
  // 可以确保所有请求都经过 Next.js 的处理，避免出现 "Cannot GET /" 或 404 错误，确保单页应用（SPA）的路由正常工作。
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  // 再使用http创建一个服务器实例的原因是，便于做基于HTTP底层的功能拓展
  httpServer = http.createServer(server)
  httpServer.listen(process.env.SERVER_PORT)
  httpServer.on('error', onError)
  httpServer.on('listening', onListening)
})
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(e) {
  var addr = httpServer.address()
  console.log('服务启动 ====>', addr.port)
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}
