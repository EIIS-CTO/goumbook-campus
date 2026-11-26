import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { CalendarPlus, ChevronLeft, ChevronRight, Clock, MapPin, Video } from "lucide-react";
import { useI18n } from "../i18n";
import { EVENTS, person, type CampusEvent, type EventKind } from "../data/mock";
import { Avatar, Button, PageTitle } from "../components/ui";

const TINTA: Record<EventKind, string> = {
  live: "bg-brand-soft text-link",
  inperson: "bg-community-soft text-community",
  deadline: "bg-pink/12 text-pink",
  ceremony: "bg-ai-soft text-ai",
};

export function DateChip({ date, kind }: { date: Date; kind: EventKind }) {
  const { locale } = useI18n();
  return (
    <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl leading-none ${TINTA[kind]}`}>
      <span className="text-[10px] font-semibold uppercase">{date.toLocaleDateString(locale, { month: "short" })}</span>
      <span className="mt-0.5 font-heading text-[18px] font-semibold">{date.getDate()}</span>
    </span>
  );
}

const stessoGiorno = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export function Calendar() {
  const { t, l, locale } = useI18n();
  const [params, setParams] = useSearchParams();
  const scelto = EVENTS.find((e) => e.id === params.get("event"));
  const [giorno, setGiorno] = useState<Date>(scelto?.start ?? new Date());
  const [mese, setMese] = useState(() => new Date(giorno.getFullYear(), giorno.getMonth(), 1));

  const celle = useMemo(() => {
    const primo = new Date(mese);
    const inizio = new Date(primo);
    inizio.setDate(1 - ((primo.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(inizio);
      d.setDate(inizio.getDate() + i);
      return d;
    });
  }, [mese]);

  const giorniSettimana = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locale, { weekday: "short" }));
  const delGiorno = EVENTS.filter((e) => stessoGiorno(e.start, giorno));
  const prossimi = EVENTS.filter((e) => e.end > new Date()).sort((a, b) => +a.start - +b.start);
  const oggi = new Date();

  return (
    <>
      <PageTitle title={t("Calendar")} subtitle={t("Live sessions, in-person experiences and deadlines")} />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-[18px] font-semibold capitalize">{mese.toLocaleDateString(locale, { month: "long", year: "numeric" })}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => setMese(new Date(mese.getFullYear(), mese.getMonth() - 1, 1))} aria-label={t("Previous month")} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-subtle">
                <ChevronLeft size={18} className="rtl:-scale-x-100" />
              </button>
              <button
                onClick={() => {
                  setMese(new Date(oggi.getFullYear(), oggi.getMonth(), 1));
                  setGiorno(oggi);
                }}
                className="h-9 rounded-full border border-line px-3.5 text-[13px] font-semibold hover:border-line-strong"
              >
                {t("Today")}
              </button>
              <button onClick={() => setMese(new Date(mese.getFullYear(), mese.getMonth() + 1, 1))} aria-label={t("Next month")} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-subtle">
                <ChevronRight size={18} className="rtl:-scale-x-100" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {giorniSettimana.map((g) => (
              <p key={g} className="eyebrow py-2">
                {g}
              </p>
            ))}
            {celle.map((d) => {
              const fuori = d.getMonth() !== mese.getMonth();
              const ev = EVENTS.filter((e) => stessoGiorno(e.start, d));
              const sel = stessoGiorno(d, giorno);
              const weekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setGiorno(d)}
                  className={`flex min-h-[58px] flex-col items-start gap-1 rounded-xl border p-1.5 text-start sm:min-h-[76px] sm:p-2 ${
                    sel ? "border-brand bg-brand-soft" : weekend ? "border-transparent bg-inset" : "border-transparent hover:bg-subtle"
                  } ${fuori ? "opacity-40" : ""}`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] tabular-nums ${
                      stessoGiorno(d, oggi) ? "bg-brand font-bold text-on-brand" : ""
                    }`}
                  >
                    {d.getDate()}
                  </span>
                  {ev.map((e) => (
                    <span key={e.id} className={`hidden w-full truncate rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold sm:block ${TINTA[e.kind]}`}>
                      {l(e.title)}
                    </span>
                  ))}
                  {ev.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brand sm:hidden" />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col gap-5">
          {scelto ? (
            <EventCard e={scelto} onClose={() => setParams({})} />
          ) : (
            <section className="card p-5">
              <h3 className="font-semibold">{giorno.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</h3>
              {delGiorno.length === 0 ? (
                <p className="mt-2 text-content-2">{t("Nothing on this day.")}</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {delGiorno.map((e) => (
                    <li key={e.id}>
                      <button onClick={() => setParams({ event: e.id })} className="w-full rounded-xl border border-line p-3 text-start hover:border-line-strong">
                        <span className="block font-semibold">{l(e.title)}</span>
                        <span className="text-[12.5px] text-content-2">
                          {e.start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })} · {l(e.where)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          <section className="card p-5">
            <h3 className="text-[18px] font-semibold">{t("Upcoming events")}</h3>
            <ul className="mt-2 flex flex-col divide-y divide-line">
              {prossimi.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => {
                      setParams({ event: e.id });
                      setGiorno(e.start);
                      setMese(new Date(e.start.getFullYear(), e.start.getMonth(), 1));
                    }}
                    className="flex w-full items-center gap-3 py-3 text-start"
                  >
                    <DateChip date={e.start} kind={e.kind} />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{l(e.title)}</span>
                      <span className="block truncate text-[12.5px] text-content-2">
                        {e.start.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })} · {l(e.where)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function EventCard({ e, onClose }: { e: CampusEvent; onClose: () => void }) {
  const { t, l, locale } = useI18n();
  const [iscritto, setIscritto] = useState(false);
  const tipo = { live: t("Live session"), inperson: t("In person"), deadline: t("Deadline"), ceremony: t("Ceremony") }[e.kind];
  const ics = () => {
    const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const testo = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//MiiS Digital Campus//Preview//EN",
      "BEGIN:VEVENT",
      `UID:${e.id}@miis-preview`,
      `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(e.start)}`,
      `DTEND:${f(e.end)}`,
      `SUMMARY:${l(e.title)}`,
      `LOCATION:${l(e.where)}`,
      `DESCRIPTION:${l(e.description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([testo], { type: "text/calendar" }));
    a.download = `${e.id}.ics`;
    a.click();
  };
  return (
    <section className="card fade-up p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${TINTA[e.kind]}`}>{tipo}</span>
        <button onClick={onClose} className="text-[12.5px] text-content-2 hover:text-content">
          {t("Close")}
        </button>
      </div>
      <h3 className="mt-3 text-[19px] leading-snug font-semibold">{l(e.title)}</h3>
      <p className="mt-2 text-content-2">{l(e.description)}</p>
      <ul className="mt-4 flex flex-col gap-2 text-[13.5px]">
        <li className="flex items-center gap-2">
          <Clock size={15} className="text-content-2" />
          {e.start.toLocaleString(locale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
        </li>
        <li className="flex items-center gap-2">
          {e.kind === "live" ? <Video size={15} className="text-content-2" /> : <MapPin size={15} className="text-content-2" />}
          {l(e.where)}
        </li>
      </ul>
      {e.host && (
        <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-inset p-3">
          <Avatar id={e.host} size={32} />
          <span className="text-[13px]">
            <span className="block font-medium">{l(person(e.host).name)}</span>
            <span className="text-content-2">{l(person(e.host).role)}</span>
          </span>
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {e.kind !== "deadline" && e.end > new Date() && (
          <Button onClick={() => setIscritto(!iscritto)} variant={iscritto ? "secondary" : "primary"}>
            {iscritto ? `✓ ${t("You're in")}` : t("I'll be there")}
          </Button>
        )}
        <Button variant="secondary" onClick={ics}>
          <CalendarPlus size={15} />
          {t("Add to calendar")}
        </Button>
      </div>
    </section>
  );
}
