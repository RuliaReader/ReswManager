import * as path from 'path'
import { Express } from 'express'
import webpack from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

import { webpackConfig } from './webpack.conf'
import { setTemplate } from '../modules/template'

/**
 * Initialize static files serving.
 * Serve static files from server directly.
 *
 * @param app
 */
const staticServing = (app: Express) => {
  const compiler = webpack(webpackConfig, () => {
    // This callback is used for removing the incorrect warning.
    // https://github.com/webpack/webpack-cli/issues/1918
  })

  const devMW = devMiddleware(compiler, {
    publicPath: webpackConfig.output?.publicPath ?? '/',
    stats: false
  })

  const hotMW = hotMiddleware(compiler)

  // Hot reload function.
  compiler.hooks.afterCompile.tap('HtmlWebpackPlugin', () => {
    hotMW.publish({ action: 'reload' })
  })

  compiler.hooks.done.tap('*', async () => {
    const fs = devMW.context.outputFileSystem
    const outputPath = webpackConfig.output?.path ?? ''
    const tplFiles = await new Promise<string[]>((resolve, reject) => {
      fs.readdir?.(path.join(outputPath, './templates'), (error, fileList) => {
        if (error) {
          return reject(error)
        }
        resolve(fileList as string[])
      })
    })

    tplFiles.forEach((tplName: string) => {
      const tplPath = path.join(outputPath, './templates/' + tplName)
      setTemplate(
        tplName.replace('.html', ''),
        fs.readFileSync?.(tplPath)?.toString() ?? ''
      )
    })
  })

  app.use(devMW)
  app.use(hotMW)
}

export {
  staticServing
}
