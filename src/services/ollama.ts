import { Ollama } from 'ollama'

const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434'
export const ollama = new Ollama({ host: ollamaHost })
