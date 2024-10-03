import * as z from 'zod';

export const topicTypeSchema = z.object({
  name: z.string({ required_error: "Le nom est requis." }).min(1, "Le nom est requis.").max(255, "La nom ne peut pas dépasser 500 caractères.")
})