export const environment = {
  port: Number(process.env.PORT) || 3000,
  openAIKey: process.env.OPENAI_API_KEY || '',
  openAIBaseURL: process.env.OPENAI_API_BASE_URL || '',
}
