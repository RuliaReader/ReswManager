/**
 *  Express-Typescript Template.
 *  Server Entry.
 *
 *  @author LancerComet
 *  @license MIT
 */

import 'dotenv/config'

import * as http from 'http'
import * as path from 'path'

import express from 'express'
import cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'

import { initControllers } from './controllers'
import { staticServing } from './build'
import { GlobalEnv } from './modules/env'

const app = express()
const host = GlobalEnv.host
const port = GlobalEnv.port

if (!host || !port || isNaN(port)) {
  console.error('Please specific a host and a port.')
  process.exit(1)
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', port)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/', express.static(path.resolve(__dirname, './public')))

staticServing(app)
initControllers(app)

// 404.
app.use((req, res) => {
  res.status(404).send('404 Not found')
})

// Other errors.
app.use((req, res) => {
  res.status(500).send('500 Internal error')
})

const server = http.createServer(app)
server.listen(port, host)

server.on('error', error => {
  console.error(`[Error] Server startup failed: ${error}`)
  process.exit(1)
})

server.on('listening', () => {
  console.log(`Server is going to start at ${host}:${port}...`)
})
