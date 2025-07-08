import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export function validateRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  schema: z.ZodSchema
): any {
  try {
    return schema.parse(request.body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      reply.status(400).send({
        error: 'Validation failed',
        details: missingFields,
      })
    } else {
      reply.status(400).send({ error: 'Invalid request format' })
    }
    return undefined
  }
}
