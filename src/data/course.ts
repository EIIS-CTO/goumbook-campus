import en from "./course.en.json";
import ar from "./course.ar.json";
import type { Lang } from "../i18n";

/**
 * Il corso che Goumbook aveva sul vecchio campus (DMOOD, organizzazione
 * «EIIS | Goumbook»): «Innovation for Sustainability», sette sezioni, letture,
 * video Vimeo e test. Testi originali in inglese, traduzione araba a parte.
 */
export type Option = { text: string; correct: boolean; feedback: string | null };
export type Question = { id: string; kind: string; text: string; options: Option[] };
export type Lesson = {
  id: string;
  type: "reading" | "video" | "test";
  title: string;
  locked: boolean;
  html?: string;
  vimeo?: { id: string; h: string } | null;
  questions?: Question[];
};
export type Section = { id: string; title: string; description: string; locked: boolean; lessons: Lesson[] };
export type Course = { id: string; title: string; sections: Section[] };

const COURSES: Record<Lang, Course> = { en: en as Course, ar: ar as Course };

export function course(lang: Lang): Course {
  return COURSES[lang];
}

/** Tutte le lezioni in fila, con la loro sezione. */
export function lessonsInOrder(c: Course) {
  return c.sections.flatMap((s) => s.lessons.map((l) => ({ lesson: l, section: s })));
}

/** L'ultima sezione si apre quando le altre sono finite, come il certificato sul campus. */
export const FINAL_SECTION = "s1485";
