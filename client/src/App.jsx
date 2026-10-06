import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import trackPageView from "../utils/tracker";
import { SettingsProvider } from "./context/SettingsContext";
import { lazy, Suspense, useEffect, useState } from "react";
import Nav from "./Components/shared/Navbar";
import Footer from "./Components/shared/Footer";
import Home from "./pages/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import { usePageMeta } from "./seo";

// Loaded only when opened, so visitors don't download them up front (the admin panel especially)
const Aboutus = lazy(() => import("./pages/Aboutus"));
const Contact = lazy(() => import("./pages/Contact"));
const Services = lazy(() => import("./pages/Services"));
const Legal = lazy(() => import("./pages/Legal"));
const Careers = lazy(() => import("./pages/Careers"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LoginForm = lazy(() => import("./Components/LoginForm"));
const AdminPanel = lazy(() => import("./admin/Main/AdminPanel"));

// Chat widget (and its socket.io connection) loads after the page has finished loading
const ChatBox = lazy(() => import("./Components/shared/ChatBox"));

// Shown for a moment while a page's code loads (keeps the footer from jumping up)
const PageFallback = () => <div style={{ minHeight: "60vh" }} />;

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chatReady, setChatReady] = useState(false);

  // Title, description and canonical URL for the current page (search engines + link previews)
  usePageMeta(location.pathname);

  // Define paths where Nav, Footer, and ChatBox should be hidden
  const hideLayoutPaths = ["/admin", "/admin/login", "/admin-panel"];
  const hideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // One page view per route change (the tracker skips admin/login pages itself)
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Handle scroll to top on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Start loading the chat widget 3s after the page has finished loading
  useEffect(() => {
    let timer;
    const start = () => {
      timer = setTimeout(() => setChatReady(true), 3000);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  return (
    <>
      <SettingsProvider>
        {/* Render Nav only for non-admin pages */}
        {!hideLayout && <Nav />}

        <div className="App">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/Legal" element={<Legal />} />
              <Route path="/Careers" element={<Careers />} />
              <Route path="/FAQ" element={<FAQ />} />

              {/* Admin routes */}
              <Route
                path="/login"
                element={<LoginForm onLogin={() => setIsAuthenticated(true)} />}
              />
              <Route
                path="/admin-panel/*"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={<Navigate to="/admin/login" replace />}
              />
              {/* Logout / expired session land here — login is a modal on the site, so go home */}
              <Route path="/admin/login" element={<Navigate to="/" replace />} />

              {/* Anything else: 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>

        {/* ChatBox appears on all pages except admin routes (after the page has loaded) */}
        {!hideLayout && chatReady && (
          <Suspense fallback={null}>
            <ChatBox />
          </Suspense>
        )}

        {/* Footer appears on all pages except admin routes */}
        {!hideLayout && <Footer />}
      </SettingsProvider>
    </>
  );
}

// Wrap App with Router if it's not already wrapped in your main index.js
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}