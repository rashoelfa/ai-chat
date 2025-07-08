import { FastifyReply, FastifyRequest } from 'fastify'
import { ollama } from '../services/ollama'

export const chat = async (request: FastifyRequest, reply: FastifyReply) => {
  const { model, messages, stream } = request.validatedBody

  try {
    if (stream) {
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })

      console.log([
        {
          role: 'system',
          content:
            "You are a helpful assistant. Please respond based on the user's input.",
        },
        ...messages,
      ])

      const chatStream = await ollama.chat({
        model,
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful assistant. Please respond based on the user's input.",
          },
          ...messages,
        ],
        stream: true,
      })

      for await (const chunk of chatStream) {
        reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`)
      }

      reply.raw.end()
    } else {
      const result = await ollama.chat({
        model,
        messages: [
          {
            role: 'system',
            content:
              "You are a helpful assistant. Please respond based on the user's input.",
          },
          ...messages,
        ],
      })
      return {
        response: result.message.content.replace(
          /<think>[\s\S]*?<\/think>\n\n/g,
          ''
        ),
      }
    }
  } catch (err) {
    console.error('Chat error:', err)
    reply.status(500).send({ error: 'Chat request failed' })
  }
}
