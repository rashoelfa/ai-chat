import OpenAI from 'openai'
import { environment } from '../config/environment'

export const client = new OpenAI({
  baseURL: environment.openAIBaseURL,
  apiKey: environment.openAIKey,
})
