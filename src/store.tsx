import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { course, FINAL_SECTION } from "./data/course";
import { POSTS, type Post, type Reply } from "./data/mock";

/**
 * Lo stato dell'anteprima: cosa ha fatto chi la prova. Vive nel browser di chi
 * guarda (localStorage) e si può azzerare dal menu dell'utente. Si parte a metà
 * strada — benvenuto finito, un modulo cominciato — perché un campus vuoto non
 * racconta niente.
 */
type Answer = { choice?: number; text?: string; checked?: boolean };
export type Note = { id: string; lessonId: string | null; text: string; at: number };
type MyPost = Omit<Post, "at" | "replies"> & { at: number; replies: (Omit<Reply, "at"> & { at: number })[] };

type State = {
  done: Record<string, true>;
  answers: Record<string, Answer>;
  notes: Note[];
  liked: Record<string, true>;
  votes: Record<string, number>;
  myPosts: MyPost[];
  myReplies: Record<string, (Omit<Reply, "at"> & { at: number })[]>;
  readNotices: Record<string, true>;
  connections: Record<string, true>;
  lastLesson: string | null;
};

const INIZIO: State = {
  done: { l1411: true, l1412: true, l1394: true, l1395: true, l1396: true },
  answers: { q300: { text: "Respecting the rights of the people who work along the value chain, and listening to the communities around them.", checked: true } },
  notes: [
    {
      id: "n0",
      lessonId: "l1395",
      text: "Human rights due diligence → identify, prevent, mitigate, account for. Check our supplier code of conduct.",
      at: Date.now() - 86_400_000 * 2,
    },
  ],
  liked: { w1: true },
  votes: {},
  myPosts: [],
  myReplies: {},
  readNotices: { n4: true, n5: true },
  connections: {},
  lastLesson: "l1397",
};

const CHIAVE = "miis-state-v1";

function leggi(): State {
  try {
    const s = localStorage.getItem(CHIAVE);
    if (s) return { ...INIZIO, ...JSON.parse(s) };
  } catch {
    /* niente memoria: si riparte dall'inizio */
  }
  return INIZIO;
}

type Ctx = State & {
  complete: (lessonId: string) => void;
  setAnswer: (qid: string, a: Answer) => void;
  addNote: (lessonId: string | null, text: string) => void;
  removeNote: (id: string) => void;
  toggleLike: (id: string) => void;
  vote: (postId: string, option: number) => void;
  addPost: (group: string, text: string, title?: string) => string;
  addReply: (postId: string, text: string, ai?: string) => void;
  readNotice: (id: string) => void;
  readAllNotices: (ids: string[]) => void;
  connect: (id: string) => void;
  visit: (lessonId: string) => void;
  reset: () => void;
  progress: { done: number; total: number; percent: number };
  sectionOpen: (sectionId: string) => boolean;
  impact: { profile: number; community: number; course: number; total: number };
  posts: Post[];
};

const Store = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(leggi);

  useEffect(() => {
    try {
      localStorage.setItem(CHIAVE, JSON.stringify(state));
    } catch {
      /* lo stato vale per la visita */
    }
  }, [state]);

  const c = course("en");
  const tutte = useMemo(() => c.sections.filter((s) => s.id !== FINAL_SECTION).flatMap((s) => s.lessons), [c]);
  const progress = useMemo(() => {
    const total = c.sections.flatMap((s) => s.lessons).length;
    const done = c.sections.flatMap((s) => s.lessons).filter((l) => state.done[l.id]).length;
    return { done, total, percent: Math.round((done / total) * 100) };
  }, [c, state.done]);

  const sectionOpen = useCallback(
    (sectionId: string) => sectionId !== FINAL_SECTION || tutte.every((l) => state.done[l.id]),
    [tutte, state.done],
  );

  const posts = useMemo<Post[]>(() => {
    const miei: Post[] = state.myPosts.map((p) => ({
      ...p,
      at: new Date(p.at),
      replies: p.replies.map((r) => ({ ...r, at: new Date(r.at) })),
    }));
    const tutti = [...miei, ...POSTS].map((p) => ({
      ...p,
      replies: [...p.replies, ...(state.myReplies[p.id] ?? []).map((r) => ({ ...r, at: new Date(r.at) }))],
    }));
    return tutti;
  }, [state.myPosts, state.myReplies]);

  // L'indice di impatto con i pesi del campus EIIS: profilo 20, community 35, corso 45.
  const impact = useMemo(() => {
    const profile = 72;
    const mieiPost = state.myPosts.length;
    const mieRisposte = Object.values(state.myReplies).flat().filter((r) => r.author === "me").length;
    const like = Object.keys(state.liked).length;
    const contatti = Object.keys(state.connections).length + 2;
    const community = Math.min(100, Math.min(5, mieiPost) * 14 + Math.min(10, mieRisposte) * 6 + Math.min(15, like) * 2 + Math.min(5, contatti) * 8);
    const corso = Math.min(100, Math.round(progress.percent * 0.6 + Object.values(state.answers).filter((a) => a.checked).length * 5));
    const total = Math.round(profile * 0.2 + community * 0.35 + corso * 0.45);
    return { profile, community, course: corso, total };
  }, [state, progress.percent]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      progress,
      sectionOpen,
      impact,
      posts,
      complete: (id) => setState((s) => ({ ...s, done: { ...s.done, [id]: true } })),
      setAnswer: (qid, a) => setState((s) => ({ ...s, answers: { ...s.answers, [qid]: { ...s.answers[qid], ...a } } })),
      addNote: (lessonId, text) =>
        setState((s) => ({ ...s, notes: [{ id: crypto.randomUUID(), lessonId, text, at: Date.now() }, ...s.notes] })),
      removeNote: (id) => setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      toggleLike: (id) =>
        setState((s) => {
          const liked = { ...s.liked };
          if (liked[id]) delete liked[id];
          else liked[id] = true;
          return { ...s, liked };
        }),
      vote: (postId, option) => setState((s) => ({ ...s, votes: { ...s.votes, [postId]: option } })),
      addPost: (group, text, title) => {
        const id = "my-" + crypto.randomUUID();
        setState((s) => ({
          ...s,
          myPosts: [
            {
              id,
              group,
              author: "me",
              title: title ? { en: title, ar: title } : undefined,
              text: { en: text, ar: text },
              at: Date.now(),
              likes: 0,
              replies: [],
            },
            ...s.myPosts,
          ],
        }));
        return id;
      },
      addReply: (postId, text, ai) =>
        setState((s) => ({
          ...s,
          myReplies: {
            ...s.myReplies,
            [postId]: [
              ...(s.myReplies[postId] ?? []),
              {
                id: crypto.randomUUID(),
                author: ai ? "ai" : "me",
                ai: Boolean(ai),
                text: { en: ai ?? text, ar: ai ?? text },
                at: Date.now(),
                likes: 0,
              },
            ],
          },
        })),
      readNotice: (id) => setState((s) => ({ ...s, readNotices: { ...s.readNotices, [id]: true } })),
      readAllNotices: (ids) =>
        setState((s) => ({ ...s, readNotices: { ...s.readNotices, ...Object.fromEntries(ids.map((i) => [i, true as const])) } })),
      connect: (id) => setState((s) => ({ ...s, connections: { ...s.connections, [id]: true } })),
      visit: (lessonId) => setState((s) => (s.lastLesson === lessonId ? s : { ...s, lastLesson: lessonId })),
      reset: () => setState(INIZIO),
    }),
    [state, progress, sectionOpen, impact, posts],
  );

  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export function useStore() {
  const c = useContext(Store);
  if (!c) throw new Error("useStore fuori da StoreProvider");
  return c;
}
