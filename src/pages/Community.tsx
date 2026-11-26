import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router";
import { ArrowRight, ExternalLink, Heart, MessageCircle, Pin, Plus, Search, UserPlus, Users } from "lucide-react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { GROUPS, ME, PEOPLE, person, type Post } from "../data/mock";
import { Avatar, Button, PageTitle, PersonBadges, useAgo } from "../components/ui";
import { useAssistant } from "../components/Assistant";

export function CommunityOverview() {
  const { t, l } = useI18n();
  const { posts, myPosts, liked, connections } = useStore();
  const ultimi = posts.slice(0, 4);
  return (
    <>
      <PageTitle
        title={t("Community")}
        action={
          <Link to="/community/groups/cohort?new=1" className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 font-semibold text-on-brand hover:bg-brand-hover">
            <Plus size={16} />
            {t("New post")}
          </Link>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-5">
          <section className="card flex flex-col items-center p-6 text-center">
            <Avatar id="me" size={80} />
            <p className="mt-3 font-heading text-[17px] font-semibold">{l(ME.name)}</p>
            <p className="text-[13px] text-content-2">{l(ME.role)}</p>
            <div className="mt-4 grid w-full grid-cols-3 divide-x divide-line rounded-2xl border border-line rtl:divide-x-reverse">
              {[
                { n: Object.keys(connections).length + 2, label: t("Connections") },
                { n: myPosts.length + 1, label: t("Contributions") },
                { n: Object.keys(liked).length, label: t("Reactions") },
              ].map((s) => (
                <div key={s.label} className="py-3">
                  <p className="font-heading text-[18px] font-semibold">{s.n}</p>
                  <p className="text-[11.5px] text-content-2">{s.label}</p>
                </div>
              ))}
            </div>
            <Link to="/profile" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-line font-semibold hover:border-line-strong">
              <ExternalLink size={15} />
              {t("See your public profile")}
            </Link>
          </section>
          <section className="card p-5">
            <h3 className="font-semibold">{t("Your groups")}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <Link to={`/community/groups/${g.id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-subtle">
                    <span className="h-10 w-10 shrink-0 rounded-xl" style={{ background: g.cover }} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-semibold">{l(g.name)}</span>
                      <span className="text-[12px] text-content-2">{t("{n} members", { n: g.members })}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="flex flex-col gap-5">
          {myPosts.length === 0 && (
            <section className="card flex flex-wrap items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-community-soft text-community">
                <MessageCircle size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t("The first post counts double")}</p>
                <p className="text-content-2">{t("You haven't written anything yet: one thing you learned in the last lesson and one question are enough to start a conversation.")}</p>
              </div>
              <Link to="/community/groups/cohort?new=1" className="inline-flex h-9 items-center rounded-full border border-line px-3.5 text-[13px] font-semibold hover:border-line-strong">
                {t("Write in the group")} ›
              </Link>
            </section>
          )}
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-semibold">{t("Latest discussions")}</h3>
              <Link to="/community/groups" className="text-[13px] font-semibold text-link hover:underline">
                {t("Go to the groups")} ›
              </Link>
            </div>
            <div className="mt-3 flex flex-col gap-4">
              {ultimi.map((p) => (
                <PostCard key={p.id} post={p} compact />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export function People() {
  const { t, l } = useI18n();
  const { connections, connect } = useStore();
  const [q, setQ] = useState("");
  const lista = PEOPLE.filter((p) => (l(p.name) + l(p.role) + p.interests.map(l).join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageTitle title={t("Connections")} subtitle={t("The people of your cohort: find who shares your interests.")} />
      <label className="relative mb-5 block max-w-md">
        <span className="sr-only">{t("Search a person")}</span>
        <Search size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-content-2" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("Search by name, role or interest…")}
          className="h-11 w-full rounded-full border border-line bg-surface ps-10 pe-4 outline-none focus:border-brand"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((p) => {
          const collegato = p.connected || connections[p.id];
          return (
            <div key={p.id} className="card flex flex-col p-5">
              <Link to={`/profile/${p.id}`} className="flex items-center gap-3">
                <Avatar id={p.id} size={48} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{l(p.name)}</span>
                  <span className="block truncate text-[12.5px] text-content-2">
                    {l(p.role)} · {l(p.city)}
                  </span>
                </span>
              </Link>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <PersonBadges id={p.id} />
                {p.interests.map((i) => (
                  <span key={i.en} className="rounded-full bg-subtle px-2 py-0.5 text-[11.5px] text-content-2">
                    {l(i)}
                  </span>
                ))}
              </div>
              <div className="mt-auto pt-4">
                <Button variant={collegato ? "secondary" : "primary"} className="w-full" disabled={Boolean(collegato)} onClick={() => connect(p.id)}>
                  {collegato ? `✓ ${t("Connected")}` : (
                    <>
                      <UserPlus size={15} /> {t("Connect")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function Groups() {
  const { t, l } = useI18n();
  const { posts } = useStore();
  return (
    <>
      <PageTitle title={t("Groups")} subtitle={t("Where the cohort talks: the group of the course and the thematic ones.")} />
      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => (
          <Link key={g.id} to={`/community/groups/${g.id}`} className="card card-lift overflow-hidden">
            <div className="h-28" style={{ background: g.cover }} />
            <div className="p-5">
              {g.course && <span className="eyebrow">{t("Group of the course")}</span>}
              <h2 className="mt-1 text-[19px] font-semibold">{l(g.name)}</h2>
              <p className="mt-1 text-content-2">{l(g.description)}</p>
              <p className="mt-4 flex items-center gap-4 text-[12.5px] text-content-2">
                <span className="flex items-center gap-1.5">
                  <Users size={14} /> {t("{n} members", { n: g.members })}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} /> {t("{n} posts", { n: posts.filter((p) => p.group === g.id).length })}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export function GroupFeed() {
  const { groupId } = useParams();
  const { t, l } = useI18n();
  const { posts, addPost, addReply } = useStore();
  const loc = useLocation();
  const assistant = useAssistant();
  const g = GROUPS.find((x) => x.id === groupId);
  const [testo, setTesto] = useState("");
  const [aperto, setAperto] = useState(new URLSearchParams(loc.search).has("new"));

  useEffect(() => {
    const id = loc.hash.slice(1);
    if (id) window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  }, [loc.hash]);

  if (!g) return <Navigate to="/community/groups" replace />;
  const lista = posts.filter((p) => p.group === g.id).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)) || +b.at - +a.at);

  const pubblica = () => {
    const s = testo.trim();
    if (!s) return;
    const id = addPost(g.id, s);
    setTesto("");
    setAperto(false);
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    if (/@ai\b/i.test(s)) window.setTimeout(() => addReply(id, "", assistant(s.replace(/@ai\b/gi, "")).text), 1600);
  };

  return (
    <>
      <div className="card mb-5 overflow-hidden">
        <div className="h-28 sm:h-36" style={{ background: g.cover }} />
        <div className="flex flex-wrap items-end justify-between gap-4 p-5">
          <div>
            {g.course && <p className="eyebrow">{t("Group of the course")}</p>}
            <h1 className="mt-1 text-[24px] font-semibold">{l(g.name)}</h1>
            <p className="text-content-2">{l(g.description)}</p>
          </div>
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {PEOPLE.slice(0, 5).map((p) => (
              <Avatar key={p.id} id={p.id} size={34} ring />
            ))}
            <span className="flex h-[34px] items-center rounded-full bg-subtle px-2.5 text-[12px] font-semibold ring-4 ring-surface">+{g.members - 5}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[760px] flex-col gap-4">
        <section className="card p-4">
          {aperto ? (
            <div>
              <div className="flex gap-3">
                <Avatar id="me" size={40} />
                <textarea
                  autoFocus
                  value={testo}
                  onChange={(e) => setTesto(e.target.value)}
                  rows={4}
                  placeholder={t("Share something you learned, or ask a question. Write @AI to ask the assistant.")}
                  className="min-w-0 flex-1 resize-none bg-transparent pt-2 outline-none"
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setAperto(false)}>
                  {t("Cancel")}
                </Button>
                <Button disabled={!testo.trim()} onClick={pubblica}>
                  {t("Publish")}
                </Button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAperto(true)} className="flex w-full items-center gap-3 rounded-full bg-inset py-1.5 ps-1.5 pe-1.5 text-start text-content-2">
              <Avatar id="me" size={32} />
              <span className="flex-1">{t("Share something you learned in the last lesson…")}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-on-brand">
                <ArrowRight size={15} className="rtl:-scale-x-100" />
              </span>
            </button>
          )}
        </section>
        {lista.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  );
}

export function PostCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const { t, l } = useI18n();
  const { liked, toggleLike, votes, vote, addReply } = useStore();
  const ago = useAgo();
  const assistant = useAssistant();
  const [risposta, setRisposta] = useState("");
  const [mostra, setMostra] = useState(!compact);
  const autore = person(post.author);
  const like = post.likes + (liked[post.id] ? 1 : 0);
  const voto = votes[post.id];

  const rispondi = () => {
    const s = risposta.trim();
    if (!s) return;
    addReply(post.id, s);
    setRisposta("");
    if (/@ai\b/i.test(s)) window.setTimeout(() => addReply(post.id, "", assistant(s.replace(/@ai\b/gi, "")).text), 1600);
  };

  return (
    <article id={post.id} className={compact ? "rounded-2xl border border-line p-4" : "card p-5"}>
      <header className="flex items-start gap-3">
        <Link to={`/profile/${post.author}`}>
          <Avatar id={post.author} size={40} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link to={`/profile/${post.author}`} className="font-semibold hover:underline">
              {l(autore.name)}
            </Link>
            <PersonBadges id={post.author} />
          </p>
          <p className="text-[12px] text-content-2">
            {ago(post.at)}
            {post.topic && <> · {l(post.topic)}</>}
            {compact && <> · {l(GROUPS.find((g) => g.id === post.group)!.name)}</>}
          </p>
        </div>
        {post.pinned && (
          <span className="flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-link">
            <Pin size={11} /> {t("Pinned")}
          </span>
        )}
      </header>
      {post.title && <h3 className="mt-3 text-[16px] font-semibold">{l(post.title)}</h3>}
      <p className={`mt-2 whitespace-pre-line ${compact ? "line-clamp-3 text-content-2" : ""}`}>{l(post.text)}</p>

      {post.poll && !compact && (
        <div className="mt-4 rounded-2xl border border-line p-4">
          <p className="mb-3 text-[13px] font-semibold">{l(post.poll.question)}</p>
          <div className="flex flex-col gap-2">
            {(() => {
              const tot = post.poll.options.reduce((s, o) => s + o.votes, 0) + (voto !== undefined ? 1 : 0);
              return post.poll.options.map((o, i) => {
                const n = o.votes + (voto === i ? 1 : 0);
                const pct = Math.round((n / tot) * 100);
                return voto === undefined ? (
                  <button key={i} onClick={() => vote(post.id, i)} className="rounded-xl border border-line px-4 py-2.5 text-start hover:border-brand">
                    {l(o.label)}
                  </button>
                ) : (
                  <div key={i} className="relative overflow-hidden rounded-xl border border-line px-4 py-2.5">
                    <span className="absolute inset-y-0 start-0 bg-brand-soft transition-[width] duration-500" style={{ width: `${pct}%` }} />
                    <span className="relative flex justify-between gap-3">
                      <span className={voto === i ? "font-semibold" : ""}>
                        {voto === i && "✓ "}
                        {l(o.label)}
                      </span>
                      <span className="tabular-nums">{pct}%</span>
                    </span>
                  </div>
                );
              });
            })()}
          </div>
          <p className="mt-2 text-[12px] text-content-2">
            {voto === undefined ? t("Vote to see the results") : t("Answer recorded")}
          </p>
        </div>
      )}

      <footer className="mt-3 flex items-center gap-1 text-[13px] text-content-2">
        <button
          onClick={() => toggleLike(post.id)}
          aria-pressed={Boolean(liked[post.id])}
          className={`flex h-9 items-center gap-1.5 rounded-full px-3 hover:bg-subtle ${liked[post.id] ? "font-semibold text-pink" : ""}`}
        >
          <Heart size={16} fill={liked[post.id] ? "currentColor" : "none"} /> {like}
        </button>
        <button onClick={() => setMostra(!mostra)} className="flex h-9 items-center gap-1.5 rounded-full px-3 hover:bg-subtle">
          <MessageCircle size={16} /> {post.replies.length}
        </button>
      </footer>

      {mostra && (
        <div className="mt-2 flex flex-col gap-3 border-t border-line pt-3">
          {post.replies.map((r) => (
            <div key={r.id} className="fade-up flex gap-2.5">
              <Avatar id={r.author} size={30} />
              <div className={`min-w-0 flex-1 rounded-2xl px-3.5 py-2.5 ${r.ai ? "bg-ai-soft" : "bg-inset"}`}>
                <p className="text-[12.5px]">
                  <strong>{r.author === "ai" ? t("AI assistant") : l(person(r.author).name)}</strong>
                  <span className="text-content-2"> · {ago(r.at)}</span>
                </p>
                <p className="mt-0.5 text-[13.5px] whitespace-pre-line">{l(r.text)}</p>
              </div>
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              rispondi();
            }}
            className="flex items-center gap-2.5"
          >
            <Avatar id="me" size={30} />
            <input
              value={risposta}
              onChange={(e) => setRisposta(e.target.value)}
              placeholder={t("Write a reply…")}
              className="h-10 min-w-0 flex-1 rounded-full border border-line bg-inset px-4 outline-none focus:border-brand"
            />
            <Button type="submit" disabled={!risposta.trim()} className="h-10">
              {t("Reply")}
            </Button>
          </form>
        </div>
      )}
    </article>
  );
}
