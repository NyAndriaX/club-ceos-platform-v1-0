import * as z from 'zod';

export const themeSchema = z.object({
  title: z
    .string({
      required_error: 'Le titre est requis.',
    })
    .min(1, 'Le titre est requis.')
    .max(255, 'Le titre ne peut pas dépasser 255 caractères.'),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères.')
    .optional(),
});
