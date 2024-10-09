import * as z from 'zod';
import { TopicStatus } from '@prisma/client';

const isValidContent = (content: string) => {
  const strippedContent = content.replace(/<[^>]*>/g, '').trim();
  return strippedContent.length > 0;
};

export const topicSchema = z.object({
  title: z
    .string({
      required_error: 'Le champ "Titre" est requis.',
    })
    .min(1, { message: 'Le champ "Titre" ne peut pas être vide.' })
    .max(255, { message: 'Le champ "Titre" doit contenir au maximum 255 caractères.' }),
  content: z
    .string({ required_error: 'Le contenu du message est requis.' })
    .min(1, { message: 'Le contenu du message est requis.' })
    .refine(isValidContent, { message: 'Le contenu du message ne peut pas être vide.' }),
  topicTypeId: z
    .number({
      required_error: 'Le champ "Type de sujet" est requis.',
    }),
  coverImage: z
    .string()
    .nullable()
    .optional(),
  status: z
    .nativeEnum(TopicStatus, { message: 'Le statut du sujet est invalide.' })
    .optional(),
  themeId: z
    .number({
      required_error: 'Le champ "Thème" est requis.',
    })
    .positive({ message: 'Veuillez sélectionner un thème valide.' }),
});



export const topicTypeSchema = z.object({
  name: z
    .string({ required_error: "Le nom est requis." })
    .min(1, "Le nom est requis.")
    .max(255, "Le nom ne peut pas dépasser 255 caractères."),

  coverImage: z
    .string({ required_error: "L'image de couverture est requise." })
    .min(1, "L'image de couverture est requise."),

  description: z
    .string({ required_error: "La description est requise." })
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(1000, "La description ne peut pas dépasser 1000 caractères.")
});

export const replySchema = z.object({
  content: z
    .string({ required_error: 'Le contenu du message est requis.' })
    .min(1, { message: 'Le contenu du message est requis.' })
    .refine(isValidContent, { message: 'Le contenu du message ne peut pas être vide.' }),
});