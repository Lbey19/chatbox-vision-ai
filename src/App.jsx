import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ModulesHub from "./pages/ModulesHub";
import Documentation from "./pages/Documentation";
import Quiz from "./pages/Quiz";
import Auth from "./pages/Auth";
import { ToastProvider } from "./components/toast/ToastContext";
import AuroraBackground from "./components/AuroraBackground";
import PublicAlerts from "./pages/PublicAlerts";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Gate from "./pages/Gate";
import GateGuard from "./components/GateGuard";

function Layout({ children }) {
  const loc = useLocation();
  const hideHeader = loc.pathname === "/gate";

  return (
    <div className="app-shell">
      {!hideHeader && <Header />}
      <main className="app-main">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AuroraBackground />
        <Routes>
          <Route path="/gate" element={<Gate />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <GateGuard>
                        <Home />
                      </GateGuard>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <GateGuard>
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      </GateGuard>
                    }
                  />
                  <Route
                    path="/modules"
                    element={
                      <GateGuard>
                        <ProtectedRoute>
                          <ModulesHub />
                        </ProtectedRoute>
                      </GateGuard>
                    }
                  />
                  <Route
                    path="/modules/docs"
                    element={
                      <GateGuard>
                        <ProtectedRoute>
                          <Documentation />
                        </ProtectedRoute>
                      </GateGuard>
                    }
                  />
                  <Route
                    path="/modules/quiz"
                    element={
                      <GateGuard>
                        <ProtectedRoute>
                          <Quiz />
                        </ProtectedRoute>
                      </GateGuard>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <GateGuard>
                        <ProtectedRoute>
                          <PublicAlerts />
                        </ProtectedRoute>
                      </GateGuard>
                    }
                  />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </ToastProvider>
    </Router>
  );
}
