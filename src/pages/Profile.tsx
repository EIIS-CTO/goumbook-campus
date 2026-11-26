import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Award, BookOpen, Link2, MapPin, MessagesSquare, Pencil, UserPlus, Users } from "lucide-react";
import { useI18n } from "../i18n";
import { useStore } from "../store";
import { BADGES, ME, person } from "../data/mock";
import { course } from "../data/course";
import { Avatar, Bar, BadgeChip, Button } from "../components/ui";

export function Profile() {
  const { userId } = useParams();
  const { t, l, lang } = useI18n();
  const store = useStore();
  const navigate = useNavigate();
  const io = !userId || userId === "me";
  const p = io ? ME : person(userId);
  const impatto = io ? store.impact.total : p.impact;
  const etichette = BADGES.filter((b) => (io ? ["starter"] : p.badges).includes(b.id));
  const collegato = !io && (p.connected || store.connections[p.id]);
  const c = course(lang);

  return (
    <div className="mx-auto max-w-[1024px]">
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-content-2 hover:text-content">
        <ArrowLeft size={16} className="rtl:-scale-x-100" /> {t("Back")}
      </button>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold">{t("Profile")}</h1>
          <p className="text-content-2">{io ? t("How the other participants see you") : l(p.role)}</p>
        </div>
        {io ? (
          <Button variant="secondary">
            <Pencil size={15} /> {t("Edit the profile")}
          </Button>
        ) : (
          <Button variant={collegato ? "secondary" : "primary"} disabled={Boolean(collegato)} onClick={() => store.connect(p.id)}>
            {collegato ? `✓ ${t("Connected")}` : (
              <>
                <UserPlus size={15} /> {t("Connect")}
              </>
            )}
          </Button>
        )}
      </div>

      <section className="card relative overflow-hidden p-8 text-center">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24" style={{ background: "linear-gradient(90deg, rgba(11,193,213,.18), rgba(224,36,94,.12), rgba(141,198,63,.16))" }} />
        <div className="relative flex flex-col items-center">
          <Avatar id={p.id} size={112} ring />
          <h2 className="mt-4 text-[28px] font-semibold">{l(p.name)}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-content-2">
            {l(p.role)} · <MapPin size={14} /> {l(p.city)}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {p.staff ? <span className="rounded-full bg-subtle px-2.5 py-0.5 text-[12px] font-semibold">{l(p.staff)}</span> : null}
            {etichette.map((b) => (
              <BadgeChip key={b.id} badge={b} size="full" />
            ))}
          </div>
          {!p.staff && (
            <div className="mt-5 w-full max-w-xs">
              <p>
                <span className="font-heading text-[24px] font-semibold text-link tabular-nums">{impatto}%</span>{" "}
                <span className="text-content-2">{t("Impact Index")}</span>
              </p>
              <Bar value={impatto} className="mt-2" />
            </div>
          )}
        </div>
      </section>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: BookOpen, n: 1, label: t("Courses") },
          { icon: Award, n: 0, label: t("Certificates") },
          { icon: Users, n: io ? Object.keys(store.connections).length + 2 : 6, label: t("Connections") },
          { icon: MessagesSquare, n: io ? store.myPosts.length + 1 : 4, label: t("Contributions") },
        ].map(({ icon: Icon, n, label }) => (
          <div key={label} className="card flex items-center gap-3 p-5">
            <Icon size={18} className="text-content-2" />
            <span>
              <span className="block font-heading text-[22px] leading-tight font-semibold">{n}</span>
              <span className="text-[13px] text-content-2">{label}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1.6fr_1fr]">
        <section className="card p-6">
          <h3 className="font-semibold">{t("About")}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{l(p.bio)}</p>
          <h3 className="mt-5 font-semibold">{t("Interests")}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.interests.map((i) => (
              <span key={i.en} className="rounded-full bg-brand-soft px-3 py-1 text-[13px] text-link">
                {l(i)}
              </span>
            ))}
          </div>
          {io && (
            <p className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-line p-3 text-[13px] text-content-2">
              <Link2 size={15} /> {t("Add a link (LinkedIn, website) to complete your profile.")}
            </p>
          )}
        </section>
        <section className="card p-6">
          <h3 className="font-semibold">{t("Journey")}</h3>
          <Link to="/course" className="mt-3 flex items-center gap-3 rounded-xl border border-line p-3 hover:border-line-strong">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-link">
              <BookOpen size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold">{c.title}</span>
              <Bar value={io ? store.progress.percent : Math.min(100, p.impact + 10)} className="mt-1.5" />
            </span>
          </Link>
          {io && (
            <div className="mt-5">
              <h3 className="font-semibold">{t("Your Impact Index")}</h3>
              <ul className="mt-3 flex flex-col gap-3 text-[13px]">
                {[
                  { label: t("Profile"), v: store.impact.profile, w: 20 },
                  { label: t("Community"), v: store.impact.community, w: 35 },
                  { label: t("Course"), v: store.impact.course, w: 45 },
                ].map((r) => (
                  <li key={r.label}>
                    <p className="flex justify-between">
                      <span>{r.label}</span>
                      <span className="text-content-2 tabular-nums">
                        {r.v}% · {t("weighs {w}%", { w: r.w })}
                      </span>
                    </p>
                    <Bar value={r.v} className="mt-1" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {io && (
        <section className="card mt-5 p-6">
          <h3 className="font-semibold">{t("Badges of the campus")}</h3>
          <p className="text-[13px] text-content-2">{t("A word next to the name, earned by finishing the course, through the Impact Index or given by the team.")}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {BADGES.filter((b) => b.id !== "staff").map((b) => (
              <li key={b.id} className={`flex items-center gap-3 rounded-xl border border-line p-3 ${etichette.includes(b) ? "" : "opacity-55"}`}>
                <BadgeChip badge={b} size="full" />
                <span className="text-[12.5px] text-content-2">{l(b.description)}</span>
                {etichette.includes(b) && <span className="ms-auto text-[12px] font-semibold text-success">✓</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
