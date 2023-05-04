import { Configuration, OpenAIApi } from 'openai'
import { OPEN_AI_KEY, OPEN_AI_ORG } from '../config/app-config'

const askGpt = async (prompt: string): Promise<string> => {
  const openai = new OpenAIApi(new Configuration({
    organization: OPEN_AI_ORG,
    apiKey: OPEN_AI_KEY
  }))

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5
  })

  return (response?.data?.choices?.[0]?.message?.content ?? '').trim()
}

export {
  askGpt
}
