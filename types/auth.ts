import { z } from 'zod'

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password cannot be longer than 72 characters') // bcrypt limit
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email cannot be longer than 254 characters')

export const artistNameSchema = z.string()
  .min(2, 'Artist name must be at least 2 characters')
  .max(50, 'Artist name cannot be longer than 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Artist name can only contain letters, numbers, spaces, hyphens, and underscores')

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['FAN', 'CREATOR']),
  artistName: z.string()
    .optional()
    .refine(
      (val) => val === undefined || val.length >= 2,
      'Artist name must be at least 2 characters'
    )
    .refine(
      (val) => val === undefined || val.length <= 50,
      'Artist name cannot be longer than 50 characters'
    )
    .refine(
      (val) => val === undefined || /^[a-zA-Z0-9\s\-_]+$/.test(val),
      'Artist name can only contain letters, numbers, spaces, hyphens, and underscores'
    )
})

export type RegisterFormData = z.infer<typeof registerSchema>