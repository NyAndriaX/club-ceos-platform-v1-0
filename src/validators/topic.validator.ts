import * as z from 'zod';
import { TopicStatus } from '@prisma/client';

export const topicSchema = z.object({
  title: z
    .string({
      required_error: 'Le titre est obligatoire.'
    })
    .min(1, { message: "Le titre est obligatoire." })
    .max(255, { message: "Le titre doit comporter au maximum 255 caractères." }),
  content: z
    .string({
      required_error: 'Le contenu est obligatoire'
    })
    .min(1, { message: "Le contenu est obligatoire." }),
  topicTypeId: z
    .number({
      required_error: 'Le type du sujet est obligatoire.'
    }),
  status: z
    .nativeEnum(TopicStatus, { message: "Statut de sujet invalide." })
    .optional(),
  themeId: z
    .number()
    .int({ message: "L'ID du thème doit être un nombre entier." })
    .positive({ message: "L'ID du thème doit être un nombre positif." }),
});

export const topicTypeSchema = z.object({
  name: z.string({ required_error: "Le nom est requis." }).min(1, "Le nom est requis.").max(255, "La nom ne peut pas dépasser 500 caractères.")
})