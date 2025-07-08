import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodSchema } from 'zod'
import { validateRequest } from '../validation/validate'

export function validateBody(schema: ZodSchema) {
  return (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const validated = validateRequest(request, reply, schema)
    if (!validated) return
    request.validatedBody = validated
    done()
  }
}
