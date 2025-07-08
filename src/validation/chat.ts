import z from 'zod'

export const chatRequestSchema = z.object({
  model: z.string().min(1, 'Model is required and cannot be empty'),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, 'Content is required and cannot be empty'),
    })
  ),
  stream: z.boolean().optional().default(false),
})
