const nodeEnv = process.env.NODE_ENV
const isDev = nodeEnv === 'development'
const isProd = nodeEnv === 'production'
const host = process.env.HOST as string
const port = parseInt(process.env.PORT as string) as number

const GlobalEnv = {
  isDev,
  isProd,
  host,
  port,
  nodeEnv
}

Object.freeze(GlobalEnv)

export {
  GlobalEnv
}
