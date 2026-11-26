import type { L } from "../i18n";

/**
 * Tutto quello che nell'anteprima non viene dal vecchio campus: persone,
 * gruppi, post, eventi, notifiche, FAQ, etichette. È inventato: nessuna di
 * queste persone esiste, e nessun dato viene da un partecipante vero.
 * Le date sono relative a oggi, così l'anteprima sembra sempre viva.
 */

const GIORNO = 86_400_000;
export function fra(giorni: number, ore = 0, minuti = 0) {
  const d = new Date();
  d.setHours(ore, minuti, 0, 0);
  return new Date(d.getTime() + giorni * GIORNO);
}
export function fa(minuti: number) {
  return new Date(Date.now() - minuti * 60_000);
}

export const ASSISTANT = "AI";

export type Person = {
  id: string;
  name: L;
  role: L;
  city: L;
  initials: string;
  color: string;
  staff?: L;
  bio: L;
  interests: L[];
  impact: number;
  badges: string[];
  connected?: boolean;
};

export const ME: Person = {
  id: "me",
  name: { en: "Mariam Al Hashimi", ar: "مريم الهاشمي" },
  role: { en: "Sustainability Analyst", ar: "محللة استدامة" },
  city: { en: "Dubai", ar: "دبي" },
  initials: "MH",
  color: "#0bc1d5",
  bio: {
    en: "I work on sustainability reporting and I'm curious about how innovation can make circular practices easier for everyone.",
    ar: "أعمل في إعداد تقارير الاستدامة، ويثير فضولي كيف يمكن للابتكار أن يجعل الممارسات الدائرية أسهل للجميع.",
  },
  interests: [
    { en: "Circular economy", ar: "الاقتصاد الدائري" },
    { en: "Climate data", ar: "بيانات المناخ" },
    { en: "Urban nature", ar: "الطبيعة الحضرية" },
  ],
  impact: 0,
  badges: ["starter"],
};

export const PEOPLE: Person[] = [
  {
    id: "p1",
    name: { en: "Omar Haddad", ar: "عمر حداد" },
    role: { en: "Program Coordinator", ar: "منسق البرنامج" },
    city: { en: "Dubai", ar: "دبي" },
    initials: "OH",
    color: "#263340",
    staff: { en: "Coordinator", ar: "منسق" },
    bio: { en: "I coordinate the MiiS cohort and I'm here for anything you need along the way.", ar: "أنسّق دفعة MiiS، وأنا هنا لأي شيء تحتاجونه طوال الرحلة." },
    interests: [{ en: "Community building", ar: "بناء المجتمعات" }, { en: "Impact measurement", ar: "قياس الأثر" }],
    impact: 0,
    badges: ["staff"],
  },
  {
    id: "p2",
    name: { en: "Layla Nasser", ar: "ليلى ناصر" },
    role: { en: "Brand Manager", ar: "مديرة علامة تجارية" },
    city: { en: "Abu Dhabi", ar: "أبوظبي" },
    initials: "LN",
    color: "#e0245e",
    bio: { en: "Marketing with a conscience. I want our campaigns to change habits, not just sell.", ar: "تسويق بضمير. أريد لحملاتنا أن تغيّر العادات، لا أن تبيع فحسب." },
    interests: [{ en: "Behavioral science", ar: "العلوم السلوكية" }, { en: "Food waste", ar: "هدر الطعام" }],
    impact: 72,
    badges: ["voice", "starter"],
    connected: true,
  },
  {
    id: "p3",
    name: { en: "Daniel Okafor", ar: "دانيال أوكافور" },
    role: { en: "Data Scientist", ar: "عالم بيانات" },
    city: { en: "Dubai", ar: "دبي" },
    initials: "DO",
    color: "#7b5ce0",
    bio: { en: "Satellite imagery, GIS and a lot of coffee. Happy to talk about AI and ethics.", ar: "صور الأقمار الصناعية ونظم المعلومات الجغرافية وكثير من القهوة. يسعدني الحديث عن الذكاء الاصطناعي والأخلاقيات." },
    interests: [{ en: "GIS", ar: "نظم المعلومات الجغرافية" }, { en: "AI & Ethics", ar: "الذكاء الاصطناعي والأخلاقيات" }],
    impact: 64,
    badges: ["changemaker", "starter"],
    connected: true,
  },
  {
    id: "p4",
    name: { en: "Sofia Romano", ar: "صوفيا رومانو" },
    role: { en: "Procurement Lead", ar: "رئيسة المشتريات" },
    city: { en: "Sharjah", ar: "الشارقة" },
    initials: "SR",
    color: "#8dc63f",
    bio: { en: "Responsible sourcing is my daily puzzle. Human rights in the supply chain is where I want to grow.", ar: "التوريد المسؤول هو لغزي اليومي. حقوق الإنسان في سلاسل التوريد هي المجال الذي أريد أن أنمو فيه." },
    interests: [{ en: "Supply chains", ar: "سلاسل التوريد" }, { en: "Human rights", ar: "حقوق الإنسان" }],
    impact: 51,
    badges: ["starter"],
  },
  {
    id: "p5",
    name: { en: "Yousef Al Amiri", ar: "يوسف العامري" },
    role: { en: "Operations Manager", ar: "مدير العمليات" },
    city: { en: "Dubai", ar: "دبي" },
    initials: "YA",
    color: "#f59e0b",
    bio: { en: "From logistics to space: I joined to understand how satellite data can help operations.", ar: "من الخدمات اللوجستية إلى الفضاء: انضممت لأفهم كيف تساعد بيانات الأقمار الصناعية العمليات." },
    interests: [{ en: "Space economy", ar: "اقتصاد الفضاء" }, { en: "Logistics", ar: "الخدمات اللوجستية" }],
    impact: 38,
    badges: [],
  },
  {
    id: "p6",
    name: { en: "Aisha Khan", ar: "عائشة خان" },
    role: { en: "HR Business Partner", ar: "شريكة أعمال الموارد البشرية" },
    city: { en: "Abu Dhabi", ar: "أبوظبي" },
    initials: "AK",
    color: "#06798a",
    bio: { en: "People first. Interested in grievance mechanisms and wellbeing at work.", ar: "الناس أولاً. مهتمة بآليات التظلم والرفاه في العمل." },
    interests: [{ en: "Wellbeing", ar: "الرفاه" }, { en: "Human rights", ar: "حقوق الإنسان" }],
    impact: 47,
    badges: ["voice"],
  },
  {
    id: "p7",
    name: { en: "Karim Mansour", ar: "كريم منصور" },
    role: { en: "Architect", ar: "مهندس معماري" },
    city: { en: "Dubai", ar: "دبي" },
    initials: "KM",
    color: "#3c5a48",
    bio: { en: "Designing buildings that leave room for nature. Urban biodiversity is my favourite module so far.", ar: "أصمّم مباني تترك مساحة للطبيعة. التنوع البيولوجي الحضري هو وحدتي المفضلة حتى الآن." },
    interests: [{ en: "Urban nature", ar: "الطبيعة الحضرية" }, { en: "Green buildings", ar: "المباني الخضراء" }],
    impact: 29,
    badges: [],
  },
  {
    id: "p8",
    name: { en: "Elena Petrova", ar: "إيلينا بتروفا" },
    role: { en: "Finance Specialist", ar: "أخصائية مالية" },
    city: { en: "Dubai", ar: "دبي" },
    initials: "EP",
    color: "#c026d3",
    bio: { en: "Sustainable finance and startup funding. Looking forward to the investing module.", ar: "التمويل المستدام وتمويل الشركات الناشئة. أتطلع إلى وحدة الاستثمار." },
    interests: [{ en: "Sustainable finance", ar: "التمويل المستدام" }, { en: "Startups", ar: "الشركات الناشئة" }],
    impact: 22,
    badges: [],
  },
];

export function person(id: string): Person {
  return id === "me" ? ME : (PEOPLE.find((p) => p.id === id) ?? ME);
}

/** Le etichette: le stesse tre forme del campus (tinta, contorno, pieno). */
export type Badge = { id: string; label: L; description: L; color: string; shape: "tint" | "outline" | "solid" };
export const BADGES: Badge[] = [
  {
    id: "staff",
    label: { en: "MiiS Team", ar: "فريق MiiS" },
    description: { en: "Whoever runs the campus.", ar: "من يدير الحرم الرقمي." },
    color: "#263340",
    shape: "solid",
  },
  {
    id: "changemaker",
    label: { en: "Changemaker", ar: "صانع التغيير" },
    description: { en: "At 60% of the Impact Index.", ar: "عند 60٪ من مؤشر الأثر." },
    color: "#0bc1d5",
    shape: "solid",
  },
  {
    id: "voice",
    label: { en: "Community Voice", ar: "صوت المجتمع" },
    description: { en: "Given by hand to who keeps the conversation alive.", ar: "تُمنح يدويًا لمن يُبقي الحوار حيًّا." },
    color: "#e0245e",
    shape: "outline",
  },
  {
    id: "starter",
    label: { en: "MiiS Starter", ar: "بداية MiiS" },
    description: { en: "At 10% of the Impact Index.", ar: "عند 10٪ من مؤشر الأثر." },
    color: "#8dc63f",
    shape: "tint",
  },
];

export type Group = { id: string; name: L; description: L; members: number; course?: boolean; cover: string };
export const GROUPS: Group[] = [
  {
    id: "cohort",
    name: { en: "Innovation for Sustainability · Cohort 1", ar: "الابتكار من أجل الاستدامة · الدفعة الأولى" },
    description: {
      en: "The group of the course: questions, takeaways and everything in between.",
      ar: "مجموعة الدورة: أسئلة وخلاصات وكل ما بينهما.",
    },
    members: 42,
    course: true,
    cover: "linear-gradient(135deg, #0bc1d5 0%, #06798a 100%)",
  },
  {
    id: "changemakers",
    name: { en: "Goumbook Changemakers", ar: "صنّاع التغيير في Goumbook" },
    description: {
      en: "Ideas and actions to bring what we learn into our everyday work.",
      ar: "أفكار وخطوات لنقل ما نتعلمه إلى عملنا اليومي.",
    },
    members: 18,
    cover: "linear-gradient(135deg, #8dc63f 0%, #3c5a48 100%)",
  },
];

export type Reply = { id: string; author: string; text: L; at: Date; likes: number; ai?: boolean };
export type Poll = { question: L; options: { label: L; votes: number }[] };
export type Post = {
  id: string;
  group: string;
  author: string;
  title?: L;
  text: L;
  at: Date;
  likes: number;
  pinned?: boolean;
  official?: boolean;
  topic?: L;
  poll?: Poll;
  replies: Reply[];
};

export const POSTS: Post[] = [
  {
    id: "w1",
    group: "cohort",
    author: "p1",
    pinned: true,
    official: true,
    title: { en: "Welcome to the MiiS Digital Campus! 👋", ar: "أهلًا بكم في الحرم الرقمي MiiS! 👋" },
    text: {
      en: "This is our space to learn together. Introduce yourself in a reply: your role, where you're based, and one thing you hope to take home from the program. The first post counts double on your Impact Index!",
      ar: "هذه مساحتنا لنتعلم معًا. عرّفوا بأنفسكم في ردّ: دوركم، ومكانكم، وشيء واحد تأملون أن تأخذوه من البرنامج. أول منشور يُحتسب مرتين في مؤشر الأثر!",
    },
    at: fa(60 * 24 * 6),
    likes: 24,
    replies: [
      {
        id: "w1r1",
        author: "p2",
        text: {
          en: "Hi all! Layla, brand manager in Abu Dhabi. I hope to learn how to design campaigns that really change behaviors.",
          ar: "مرحبًا بالجميع! ليلى، مديرة علامة تجارية في أبوظبي. آمل أن أتعلم كيف أصمم حملات تغيّر السلوك فعلًا.",
        },
        at: fa(60 * 24 * 6 - 40),
        likes: 6,
      },
      {
        id: "w1r2",
        author: "p3",
        text: {
          en: "Daniel here, data scientist. Very curious about the AI & Ethics module.",
          ar: "أنا دانيال، عالم بيانات. فضولي كبير تجاه وحدة الذكاء الاصطناعي والأخلاقيات.",
        },
        at: fa(60 * 24 * 5),
        likes: 4,
      },
    ],
  },
  {
    id: "p-poll",
    group: "cohort",
    author: "p1",
    official: true,
    title: { en: "Which topic should we explore in the next live session?", ar: "أي موضوع نستكشفه في الجلسة المباشرة القادمة؟" },
    text: {
      en: "Vote by Friday: the most voted topic becomes the focus of our next live Q&A with the expert.",
      ar: "صوّتوا قبل الجمعة: الموضوع الأكثر تصويتًا سيكون محور جلسة الأسئلة المباشرة القادمة مع الخبير.",
    },
    at: fa(60 * 26),
    likes: 9,
    poll: {
      question: { en: "Next live session topic", ar: "موضوع الجلسة المباشرة القادمة" },
      options: [
        { label: { en: "Satellite data for climate action", ar: "بيانات الأقمار الصناعية للعمل المناخي" }, votes: 14 },
        { label: { en: "Human rights in supply chains", ar: "حقوق الإنسان في سلاسل التوريد" }, votes: 9 },
        { label: { en: "Generative AI at work", ar: "الذكاء الاصطناعي التوليدي في العمل" }, votes: 17 },
      ],
    },
    replies: [],
  },
  {
    id: "p-q",
    group: "cohort",
    author: "p4",
    topic: { en: "Business & Human Rights", ar: "الأعمال وحقوق الإنسان" },
    text: {
      en: "After the video on grievance mechanisms: how do you make workers trust a channel that is run by the company itself? @AI any examples?",
      ar: "بعد فيديو آليات التظلم: كيف تجعل العمال يثقون بقناة تديرها الشركة نفسها؟ @AI هل من أمثلة؟",
    },
    at: fa(60 * 5),
    likes: 7,
    replies: [
      {
        id: "p-q-ai",
        author: "ai",
        ai: true,
        text: {
          en: "Great question, Sofia. The lesson points to three things that build trust: workers take part in designing the channel, they can use it anonymously and without fear of retaliation, and they see what happens after a complaint. A practical step is to publish, every quarter, how many grievances were received and how they were resolved.",
          ar: "سؤال رائع يا صوفيا. يشير الدرس إلى ثلاثة أمور تبني الثقة: أن يشارك العمال في تصميم القناة، وأن يستخدموها دون الكشف عن هويتهم ودون خوف من الانتقام، وأن يروا ما يحدث بعد الشكوى. خطوة عملية: نشر عدد التظلمات المستلمة وكيف حُلّت كل ثلاثة أشهر.",
        },
        at: fa(60 * 5 - 1),
        likes: 5,
      },
      {
        id: "p-q-r2",
        author: "p6",
        text: {
          en: "In our team we added a third-party hotline last year: reports went up, and that was a good sign.",
          ar: "في فريقنا أضفنا العام الماضي خطًا ساخنًا تديره جهة خارجية: ازدادت البلاغات، وكانت تلك علامة جيدة.",
        },
        at: fa(60 * 3),
        likes: 3,
      },
    ],
  },
  {
    id: "p-takeaway",
    group: "cohort",
    author: "p7",
    topic: { en: "Biodiversity Manager", ar: "مدير التنوع البيولوجي" },
    text: {
      en: "Takeaway from the urban biodiversity lesson: green spaces are infrastructure, not decoration. They cool the city, manage water and keep us healthy. Next project, I'm proposing a native-plant roof garden 🌿",
      ar: "خلاصة درس التنوع البيولوجي الحضري: المساحات الخضراء بنية تحتية، لا زينة. إنها تبرّد المدينة وتدير المياه وتحافظ على صحتنا. في المشروع القادم سأقترح حديقة سطح بنباتات محلية 🌿",
    },
    at: fa(60 * 30),
    likes: 15,
    replies: [
      {
        id: "p-takeaway-r1",
        author: "p2",
        text: { en: "Love this! Share some pictures when it's done 🙌", ar: "أحببت الفكرة! شارك بعض الصور عند الانتهاء 🙌" },
        at: fa(60 * 28),
        likes: 2,
      },
    ],
  },
  {
    id: "p-space",
    group: "cohort",
    author: "p5",
    topic: { en: "Space Entrepreneurship", ar: "ريادة الأعمال الفضائية" },
    text: {
      en: "Never thought a logistics manager would learn from astronauts. The point about trust in small teams under pressure really resonated with me.",
      ar: "لم أتخيل يومًا أن مدير لوجستيات سيتعلم من رواد الفضاء. فكرة الثقة في الفرق الصغيرة تحت الضغط لامستني حقًا.",
    },
    at: fa(60 * 50),
    likes: 11,
    replies: [],
  },
  {
    id: "c1",
    group: "changemakers",
    author: "p2",
    title: { en: "Zero food waste week: who's in?", ar: "أسبوع بلا هدر للطعام: من معي؟" },
    text: {
      en: "Inspired by the Food & Sustainability module: let's try a week of zero food waste in the office cafeteria and measure it. I'll prepare a simple tracking sheet.",
      ar: "استلهامًا من وحدة الغذاء والاستدامة: لنجرب أسبوعًا بلا هدر للطعام في مقصف المكتب ونقيسه. سأجهّز جدول متابعة بسيطًا.",
    },
    at: fa(60 * 20),
    likes: 13,
    replies: [
      {
        id: "c1r1",
        author: "p3",
        text: { en: "In! I can build a small dashboard with the data.", ar: "أنا معكم! يمكنني بناء لوحة بيانات صغيرة." },
        at: fa(60 * 19),
        likes: 4,
      },
    ],
  },
];

export type EventKind = "live" | "inperson" | "deadline" | "ceremony";
export type CampusEvent = { id: string; title: L; description: L; start: Date; end: Date; kind: EventKind; where: L; host?: string };

export const EVENTS: CampusEvent[] = [
  {
    id: "e0",
    title: { en: "Kick-off: welcome to the program", ar: "الانطلاقة: أهلًا بكم في البرنامج" },
    description: { en: "Meet the team and the cohort, and see how the campus works.", ar: "تعرّفوا على الفريق والدفعة، وشاهدوا كيف يعمل الحرم الرقمي." },
    start: fra(-8, 17),
    end: fra(-8, 18),
    kind: "live",
    where: { en: "Online · Zoom", ar: "عبر الإنترنت · Zoom" },
    host: "p1",
  },
  {
    id: "e1",
    title: { en: "Live Q&A: Business & Human Rights", ar: "أسئلة مباشرة: الأعمال وحقوق الإنسان" },
    description: {
      en: "Bring your questions on grievance mechanisms and responsible business conduct.",
      ar: "أحضروا أسئلتكم حول آليات التظلم والسلوك المسؤول للأعمال.",
    },
    start: fra(2, 17),
    end: fra(2, 18),
    kind: "live",
    where: { en: "Online · Zoom", ar: "عبر الإنترنت · Zoom" },
    host: "p1",
  },
  {
    id: "e2",
    title: { en: "Deadline: “Put yourself in the entrepreneur’s shoes”", ar: "الموعد النهائي: «ضع نفسك مكان رائد الأعمال»" },
    description: { en: "Submit your answer to the open exercise of the Space Entrepreneurship module.", ar: "أرسلوا إجابتكم على التمرين المفتوح في وحدة ريادة الأعمال الفضائية." },
    start: fra(6, 23, 59),
    end: fra(6, 23, 59),
    kind: "deadline",
    where: { en: "On the campus", ar: "على الحرم الرقمي" },
  },
  {
    id: "e3",
    title: { en: "Field visit: urban biodiversity walk", ar: "زيارة ميدانية: جولة التنوع البيولوجي الحضري" },
    description: {
      en: "A guided morning walk to discover the nature that lives in the city. Comfortable shoes recommended!",
      ar: "جولة صباحية بصحبة مرشد لاكتشاف الطبيعة التي تعيش في المدينة. يُنصح بأحذية مريحة!",
    },
    start: fra(10, 8, 30),
    end: fra(10, 11),
    kind: "inperson",
    where: { en: "Dubai · meeting point shared by email", ar: "دبي · نقطة اللقاء تُرسل بالبريد الإلكتروني" },
    host: "p1",
  },
  {
    id: "e4",
    title: { en: "Office hours with the coordinator", ar: "ساعات مكتبية مع المنسق" },
    description: { en: "Fifteen minutes one-to-one: progress, doubts, ideas.", ar: "خمس عشرة دقيقة على انفراد: التقدّم والأسئلة والأفكار." },
    start: fra(13, 12),
    end: fra(13, 13),
    kind: "live",
    where: { en: "Online · Google Meet", ar: "عبر الإنترنت · Google Meet" },
    host: "p1",
  },
  {
    id: "e5",
    title: { en: "Closing ceremony and certificates", ar: "حفل الختام وتسليم الشهادات" },
    description: { en: "We celebrate the end of the program together.", ar: "نحتفل معًا بختام البرنامج." },
    start: fra(27, 18),
    end: fra(27, 20),
    kind: "ceremony",
    where: { en: "Dubai · venue shared by email", ar: "دبي · يُرسل المكان بالبريد الإلكتروني" },
    host: "p1",
  },
];

export type Notice = { id: string; text: L; at: Date; to: string; kind: "post" | "event" | "unlock" | "badge" | "ai" };
export const NOTICES: Notice[] = [
  {
    id: "n1",
    kind: "ai",
    text: { en: "The AI assistant answered Sofia's question in Cohort 1", ar: "أجاب مساعد الذكاء الاصطناعي عن سؤال صوفيا في الدفعة الأولى" },
    at: fa(60 * 5 - 1),
    to: "/community/groups/cohort",
  },
  {
    id: "n2",
    kind: "event",
    text: { en: "Live Q&A: Business & Human Rights is in 2 days", ar: "جلسة الأسئلة المباشرة: الأعمال وحقوق الإنسان بعد يومين" },
    at: fa(60 * 9),
    to: "/calendar",
  },
  {
    id: "n3",
    kind: "post",
    text: { en: "Omar Haddad published a poll in Cohort 1", ar: "نشر عمر حداد استطلاعًا في الدفعة الأولى" },
    at: fa(60 * 26),
    to: "/community/groups/cohort",
  },
  {
    id: "n4",
    kind: "unlock",
    text: { en: "The module “Business & Human Rights” is now open", ar: "وحدة «الأعمال وحقوق الإنسان» متاحة الآن" },
    at: fa(60 * 24 * 3),
    to: "/course",
  },
  {
    id: "n5",
    kind: "badge",
    text: { en: "You earned the badge “MiiS Starter”", ar: "حصلت على شارة «بداية MiiS»" },
    at: fa(60 * 24 * 5),
    to: "/profile",
  },
];

export const FAQ: { q: L; a: L }[] = [
  {
    q: { en: "How long does the program take?", ar: "كم تستغرق مدة البرنامج؟" },
    a: {
      en: "About four weeks at your own pace: each module takes roughly an hour, between readings, videos and short exercises. Live sessions are optional and recorded.",
      ar: "نحو أربعة أسابيع وفق وتيرتك الخاصة: تستغرق كل وحدة قرابة ساعة بين القراءات والفيديوهات والتمارين القصيرة. الجلسات المباشرة اختيارية ومسجّلة.",
    },
  },
  {
    q: { en: "Do I need to follow the modules in order?", ar: "هل يجب أن أتبع الوحدات بالترتيب؟" },
    a: {
      en: "The welcome comes first; after that the five thematic modules are open and you can choose where to start. The last section unlocks when you have completed them all.",
      ar: "يأتي الترحيب أولًا؛ بعده تكون الوحدات الموضوعية الخمس متاحة ويمكنك اختيار من أين تبدأ. يُفتح القسم الأخير عند إتمامها جميعًا.",
    },
  },
  {
    q: { en: "What is the Impact Index?", ar: "ما هو مؤشر الأثر؟" },
    a: {
      en: "A single number that grows as you take part: 20% comes from your profile, 35% from the community (posts, replies, reactions, connections) and 45% from the course.",
      ar: "رقم واحد ينمو كلما شاركت: 20٪ من ملفك الشخصي، و35٪ من المجتمع (المنشورات والردود والتفاعلات والعلاقات)، و45٪ من الدورة.",
    },
  },
  {
    q: { en: "How do I get the certificate?", ar: "كيف أحصل على الشهادة؟" },
    a: {
      en: "Complete all the lessons and exercises: the certificate appears in Certifications, with a public link you can add to LinkedIn.",
      ar: "أكمل جميع الدروس والتمارين: تظهر الشهادة في قسم الشهادات مع رابط عام يمكنك إضافته إلى LinkedIn.",
    },
  },
  {
    q: { en: "What is the AI assistant?", ar: "ما هو مساعد الذكاء الاصطناعي؟" },
    a: {
      en: "The campus assistant. It knows the lessons, the calendar and the FAQ, and answers in your language. You find it at the top of every page, and you can mention it in the groups with @AI.",
      ar: "مساعد الذكاء الاصطناعي في الحرم الجامعي. يعرف الدروس والتقويم والأسئلة الشائعة، ويجيب بلغتك. تجده أعلى كل صفحة، ويمكنك الإشارة إليه في المجموعات بكتابة ‎@AI.",
    },
  },
  {
    q: { en: "Can I use the campus on my phone?", ar: "هل يمكنني استخدام الحرم الرقمي على هاتفي؟" },
    a: {
      en: "Yes: it works in the browser and can be installed as an app, with push notifications for new posts and events.",
      ar: "نعم: يعمل في المتصفح ويمكن تثبيته كتطبيق، مع إشعارات فورية للمنشورات والفعاليات الجديدة.",
    },
  },
];
