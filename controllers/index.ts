import { Application } from 'express'
import { getTemplate } from '../modules/template'
import { readReswFile, readStringFolder, writeReswFile } from '../modules/resw'
import fs from 'fs'

const initControllers = (app: Application) => {
  app.get('/', (req, res) => {
    res.send(getTemplate('index'))
  })

  app.get('/file/list', (req, res) => {
    const stringDir = readStringFolder()
    const firstLangDir = stringDir.paths[0]
    const reswFileNameList = fs.readdirSync(firstLangDir)
    res.send(reswFileNameList)
  })

  app.get('/file/:filename', (req, res) => {
    const filename = req.params.filename
    try {
      const result = readReswFile(filename)
      res.send(result)
    } catch (error) {
      res.status(500).send(error)
    }
  })

  app.post('/file/update', (req, res) => {
    const body = req.body as {
      filename: string
      lang: string
      xmlStr: string
    }

    try {
      writeReswFile(body.filename, body.lang, body.xmlStr)
      res.send({
        message: 'OK'
      })
    } catch (error) {
      res.status(500).send(error)
    }
  })
}

export {
  initControllers
}
