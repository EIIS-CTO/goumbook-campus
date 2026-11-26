# MiiS Digital Campus · preview

A clickable preview of the participant side of the MiiS Digital Campus, prepared for Goumbook.
English and Arabic (right to left), light and dark theme, desktop and phone.

- **Course**: «Innovation for Sustainability», the program set up for Goumbook on the previous campus: readings, Vimeo videos and exercises.
- **Everything else is fictional**: people, posts, events, notifications. The AI assistant answers from the course content, without a live AI.
- **Logos**: MiiS from the previous campus, Goumbook from goumbook.com, EIIS from the EIIS brand files; each has a version for dark backgrounds.
- **Nothing leaves the browser**: progress, answers, notes and posts are kept in the visitor's own browser (localStorage). «Start the preview again» in the user menu resets them.

Live: https://eiis-cto.github.io/goumbook-campus/

## Run locally

```bash
npm install
npm run dev
```

Built with Vite, React and Tailwind CSS. Every push to `main` is published to GitHub Pages by `.github/workflows/pages.yml`.
