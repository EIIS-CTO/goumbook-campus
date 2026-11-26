import { useNavigate } from "react-router";
import { BookOpen, CalendarDays, MessagesSquare, Sparkles } from "lucide-react";
import { useI18n } from "../i18n";
import { LangSwitch, ThemeToggle } from "../components/Shell";
import { PartnerLogos } from "../components/ui";

/**
 * L'ingresso: la pagina di accesso del campus, col marchio MiiS. Nessuna
 * password: «Entra nell'anteprima» porta dentro come partecipante di prova.
 */
export function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const entra = () => navigate("/overview");
  const base = import.meta.env.BASE_URL;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-[#0b1f26] p-12 text-white lg:flex lg:flex-col">
        <div
          aria-hidden="true"
          className="absolute -top-40 -end-40 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #0bc1d5 0%, transparent 65%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-48 -start-32 h-[460px] w-[460px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #e0245e 0%, transparent 65%)" }}
        />
        <img src={`${base}brand/miis-mark-512.png`} alt="" className="relative h-16 w-16" />
        <div className="relative mt-auto max-w-[520px]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-[#7ee6f0]">
            {t("Digital Campus · preview for Goumbook")}
          </p>
          <h1 className="text-[40px] leading-[1.1] font-semibold">{t("Learn, connect and grow your impact.")}</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-white/75">
            {t("Innovation for Sustainability: five themes, short lessons with the experts of EIIS, a community to share ideas and an assistant that knows the course.")}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-[13.5px]">
            {[
              { icon: BookOpen, text: t("Lessons, videos and exercises") },
              { icon: MessagesSquare, text: t("Groups and conversations") },
              { icon: CalendarDays, text: t("Live sessions and events") },
              { icon: Sparkles, text: t("An AI assistant for the course") },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 rounded-xl bg-white/6 px-3 py-2.5">
                <Icon size={16} className="shrink-0 text-[#7ee6f0]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-12">
          <p className="mb-3.5 text-[12px] text-white/55">{t("A program by Goumbook and EIIS")}</p>
          <PartnerLogos tone="dark" height={34} />
        </div>
      </section>

      <section className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex justify-end gap-2">
          <LangSwitch compact />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <div className="logo-plate mb-8 self-center">
            <img src={`${base}brand/miis-logo.png`} alt="MiiS" className="h-14 w-auto" />
          </div>
          <p className="mb-3 inline-flex self-center rounded-full bg-brand-soft px-3 py-1 text-[12px] font-semibold text-link lg:hidden">
            {t("Digital Campus · preview for Goumbook")}
          </p>
          <h2 className="text-center text-[26px] leading-tight font-semibold">{t("Welcome to the Digital Campus")}</h2>
          <p className="mt-2 text-center text-content-2">{t("Sign in to continue your program.")}</p>

          <button
            onClick={entra}
            className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line-strong bg-surface font-semibold hover:border-content-2"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {t("Continue with Google")}
          </button>

          <div className="my-6 flex items-center gap-3 text-[12px] text-content-2">
            <span className="h-px flex-1 bg-line" />
            {t("or")}
            <span className="h-px flex-1 bg-line" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              entra();
            }}
            className="flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium">{t("Email")}</span>
              <input
                type="email"
                dir="ltr"
                defaultValue="mariam@example.com"
                readOnly
                className="h-11 rounded-xl border border-line bg-inset px-3.5 text-content-2 outline-none"
              />
            </label>
            <button type="submit" className="mt-2 h-12 rounded-full bg-brand font-semibold text-on-brand hover:bg-brand-hover">
              {t("Enter the preview")}
            </button>
          </form>

          <p className="mt-6 rounded-xl bg-pink/8 px-4 py-3 text-[12.5px] leading-relaxed text-content-2">
            <strong className="text-pink">{t("Preview with fictional data.")}</strong>{" "}
            {t("You enter as Mariam, a participant halfway through the program. The course is the real one; people, posts and events are invented. Nothing you do here is sent anywhere.")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 lg:hidden">
            <p className="text-[12px] text-content-2">{t("A program by Goumbook and EIIS")}</p>
            <PartnerLogos height={28} />
          </div>
        </div>
      </section>
    </div>
  );
}
