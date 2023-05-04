import path from 'path'
import fs from 'fs'
import { STRING_FOLDER_PATH } from '../config/app-config'

const readStringFolder = () => {
  const folders = fs.readdirSync(STRING_FOLDER_PATH) // ['en-US', ...]
  return {
    lang: folders,
    paths: folders.map(item => path.resolve(STRING_FOLDER_PATH, item))
  }
}

const readReswFile = (filename: string): Record<string, string> => {
  const { paths: langFolderPaths, lang: langList } = readStringFolder()
  const result: Record<string, string> = {}
  langList.forEach(lang => {
    result[lang] = ''
  })

  for (let i = 0; i < langFolderPaths.length; i++) {
    const langFolderPath = langFolderPaths[i]
    const filePath = path.resolve(langFolderPath, filename)
    const fileText = fs.readFileSync(filePath, { encoding: 'utf-8' })
    const lang = langList[i]
    result[lang] = fileText
  }

  return result
}

const writeReswFile = (filename: string, lang: string, xmlStr: string) => {
  const langFolderPath = path.resolve(STRING_FOLDER_PATH, lang)
  if (!fs.existsSync(langFolderPath)) {
    fs.mkdirSync(langFolderPath)
  }
  const filePath = path.resolve(langFolderPath, filename)
  fs.writeFileSync(filePath, xmlStr, { encoding: 'utf-8' })
}

export {
  readStringFolder,
  readReswFile,
  writeReswFile
}
