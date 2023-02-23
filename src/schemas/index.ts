import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
})

export const findByIdSchema = z.object({
  id: z.string().uuid(),
})

export const findByNameSchema = z.object({
  name: z.string(),
})

export const findByEmailSchema = z.object({
  email: z.string().email(),
})

export const subSchema = z.object({
  sub: z.string().uuid(),
})

export const findByCpfSchema = z.object({
  cpf: z.string(),
})
