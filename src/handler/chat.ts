import { FastifyReply, FastifyRequest } from 'fastify'
import { client } from '../services/openai'
import { prompt } from '../services/prompt'

export const chat = async (request: FastifyRequest, reply: FastifyReply) => {
  const { model, messages, stream } = request.validatedBody

  try {
    if (stream) {
      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })

      const chatStream = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: prompt.system,
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
      const result = await client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: prompt.system,
          },
          ...messages,
        ],
      })
      return {
        response: result.choices[0].message.content,
      }
    }
  } catch (err: any) {
    console.error('Chat error:', err)
    if (err.status === 429) {
      reply
        .status(429)
        .send({ error: 'Rate limit exceeded. Please try again later.' })
      return
    }
    reply.status(500).send({ error: 'Chat request failed' })
  }
}
