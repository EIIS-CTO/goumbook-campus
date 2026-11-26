import { HashRouter, Navigate, Route, Routes } from "react-router";
import { I18nProvider } from "./i18n";
import { StoreProvider } from "./store";
import { Shell } from "./components/Shell";
import { Login } from "./pages/Login";
import { Overview } from "./pages/Overview";
import { CourseIndex, CoursePage } from "./pages/Course";
import { Calendar } from "./pages/Calendar";
import { CommunityOverview, GroupFeed, Groups, People } from "./pages/Community";
import { Profile } from "./pages/Profile";
import { Certifications, Faq, Notes } from "./pages/Support";

/**
 * Il router a «#»: GitHub Pages serve un solo file, e ogni indirizzo
 * dell'anteprima deve funzionare anche ricaricando la pagina.
 */
export function App() {
  return (
    <I18nProvider>
      <StoreProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="*"
              element={
                <Shell>
                  <Routes>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/course" element={<CourseIndex />} />
                    <Route path="/course/:lessonId" element={<CoursePage />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/certifications" element={<Certifications />} />
                    <Route path="/community" element={<CommunityOverview />} />
                    <Route path="/community/people" element={<People />} />
                    <Route path="/community/groups" element={<Groups />} />
                    <Route path="/community/groups/:groupId" element={<GroupFeed />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/overview" replace />} />
                  </Routes>
                </Shell>
              }
            />
          </Routes>
        </HashRouter>
      </StoreProvider>
    </I18nProvider>
  );
}
