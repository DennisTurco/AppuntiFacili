// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

// 2. Define your collection(s)
const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    snippet: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    lastUpdateDate: z.string().transform(str => new Date(str)),
    author: z.string().default('AppuntiFacili'),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

const informaticaCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    lastUpdateDate: z.string().transform(str => new Date(str)),
    author: z.string().default('Dennis Turco'),
    subject: z.string(),
    category: z.string(),
    videoLesson: z.boolean(),
    tags: z.array(z.string()),
  }),
});

const matematicaCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    lastUpdateDate: z.string().transform(str => new Date(str)),
    author: z.string().default('Dennis Turco'),
    subject: z.string(),
    category: z.string(),
    videoLesson: z.boolean(),
    tags: z.array(z.string()),
  }),
});

const teamCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    name: z.string(),
    title: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    lastUpdateDate: z.string().transform(str => new Date(str)),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'blog': blogCollection,
  'informatica': informaticaCollection,
  'matematica': matematicaCollection,
  'team': teamCollection,
};