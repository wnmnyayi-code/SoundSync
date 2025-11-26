import { z } from 'zod'

export const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  isPublic: z.boolean().default(true),
  genre: z.string().min(1, 'Genre is required'),
  bpm: z.number().int().min(1).max(300).optional(),
  key: z.string().optional(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  drmEnabled: z.boolean().default(false),
  isExplicit: z.boolean().default(false),
  file: z.instanceof(File)
})

export type UploadFormData = z.infer<typeof uploadSchema>