import { defineCollection, z } from 'astro:content';

const produits = defineCollection({
  type: 'data',
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    annee: z.string(),
    dimensions: z.string().optional(),
    etat: z.enum(['entoilee', 'restauree', 'a-restaurer']),
    prix: z.number().optional(),
    surDevis: z.boolean().default(false),
    disponible: z.boolean().default(true),
    images: z.array(z.string()).default([]),
    artiste: z.string().optional(),
    imprimeur: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    resume: z.string(),
    date: z.date(),
    image: z.string().optional(),
    publie: z.boolean().default(false),
  }),
});

export const collections = { produits, blog };
