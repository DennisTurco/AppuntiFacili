import { getCollection, type CollectionEntry } from "astro:content";

export type LessonCollection = "informatica" | "matematica";
export type LessonEntry = CollectionEntry<LessonCollection>;

type CategoryMeta = { label: string; icon: string };

/** Etichette e icone delle categorie (= prima cartella dello slug). */
export const CATEGORY_META: Record<string, CategoryMeta> = {
  // Informatica
  varie: { label: "Varie", icon: "fa6-solid:shapes" },
  office: { label: "Office", icon: "fa6-solid:file-word" },
  python: { label: "Python", icon: "fa6-brands:python" },
  c: { label: "C", icon: "simple-icons:c" },
  cpp: { label: "C++", icon: "simple-icons:cplusplus" },
  java: { label: "Java", icon: "fa6-brands:java" },
  csharp: { label: "C#", icon: "fa6-solid:hashtag" },
  typescript: { label: "TypeScript", icon: "simple-icons:typescript" },
  html: { label: "HTML", icon: "fa6-brands:html5" },
  sql: { label: "SQL", icon: "fa6-solid:database" },
  postgresql: { label: "PostgreSQL", icon: "simple-icons:postgresql" },
  php: { label: "PHP", icon: "fa6-brands:php" },
  "web-api": { label: "Web API", icon: "fa6-solid:server" },
  "dev-practices": { label: "Buone pratiche", icon: "fa6-solid:screwdriver-wrench" },
  "algorithms-and-data-structures": { label: "Algoritmi e strutture dati", icon: "fa6-solid:diagram-project" },
  // Matematica
  numeri: { label: "Numeri", icon: "fa6-solid:hashtag" },
  polinomi: { label: "Polinomi", icon: "fa6-solid:superscript" },
  equazioni: { label: "Equazioni", icon: "fa6-solid:equals" },
  logaritmi: { label: "Logaritmi", icon: "fa6-solid:subscript" },
  limiti: { label: "Limiti", icon: "fa6-solid:infinity" },
  derivate: { label: "Derivate", icon: "fa6-solid:chart-line" },
  altro: { label: "Altro", icon: "fa6-solid:bookmark" },
};

export function categoryMeta(slug: string): CategoryMeta {
  return (
    CATEGORY_META[slug] ?? {
      label: slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      icon: "fa6-solid:book",
    }
  );
}

export function categoryOf(entry: LessonEntry): string {
  return entry.slug.split("/")[0];
}

type Difficulty = { level: 1 | 2 | 3; label: string; classes: string };

const DIFFICULTY: Record<1 | 2 | 3, Difficulty> = {
  1: {
    level: 1,
    label: "Base",
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-400/20",
  },
  2: {
    level: 2,
    label: "Intermedio",
    classes: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-400/20",
  },
  3: {
    level: 3,
    label: "Avanzato",
    classes: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-400/20",
  },
};

/** Normalizza i valori di `difficulty` (italiano/inglese) in tre livelli. */
export function difficultyInfo(raw?: string): Difficulty | null {
  const value = raw?.trim().toLowerCase();
  if (!value) return null;
  if (["facile", "beginner", "base", "easy"].includes(value)) return DIFFICULTY[1];
  if (["medio", "intermedio", "intermediate", "medium"].includes(value)) return DIFFICULTY[2];
  if (["difficile", "complesso", "advanced", "avanzato", "hard"].includes(value)) return DIFFICULTY[3];
  return null;
}

/** Lezioni pubblicate (non draft e con data già passata). */
export async function getPublishedLessons(collection: LessonCollection): Promise<LessonEntry[]> {
  const now = new Date();
  return getCollection(collection, ({ data }) => !data.draft && data.lastUpdateDate < now);
}

/** Tempo di lettura stimato in minuti (~200 parole/minuto, esclusi i blocchi di codice). */
export function readingTime(body: string = ""): number {
  const text = body.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
