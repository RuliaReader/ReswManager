import path from 'path'
import fs from 'fs'
import { STRING_FOLDER_PATH } from '../config/app-config'

const readStringFolder = () => {
  const folders = fs.readdirSync(STRING_FOLDER_PATH)  // ['en-US', ...]
  return {
    lang: folders,
    paths: folders.map(item => path.resolve(STRING_FOLDER_PATH, item))
  }
}

const readReswFile = (fileIndex: number): Record<string, string> => {
  const { paths: langFolderPaths, lang: langList } = readStringFolder()
  const result: Record<string, string> = {}
  langList.forEach(lang => {
    result[lang] = ''
  })

  for (let i = 0; i < langFolderPaths.length; i++) {
    const langFolderPath = langFolderPaths[i]
    const fileList = fs.readdirSync(langFolderPath)
    const fileName = fileList[fileIndex]
    if (fileName) {
      const filePath = path.resolve(langFolderPath, fileName)
      const fileText = fs.readFileSync(filePath, { encoding: 'utf-8' })
      const lang = langList[i]
      result[lang] = fileText
    }
  }

  return result
}

export {
  readStringFolder,
  readReswFile
}
