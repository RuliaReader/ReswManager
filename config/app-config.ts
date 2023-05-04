import path from 'path'

const STRING_FOLDER_PATH = path.join(process.env.STRING_FOLDER_PATH as string)
const OPEN_AI_KEY = process.env.OPEN_AI_KEY
const OPEN_AI_ORG = process.env.OPEN_AI_ORG

export {
  STRING_FOLDER_PATH,
  OPEN_AI_KEY,
  OPEN_AI_ORG
}
