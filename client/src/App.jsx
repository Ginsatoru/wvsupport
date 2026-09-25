import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import trackPageView from "../utils/tracker";
import { SettingsProvider } from "./context/SettingsContext";
import { useEffect, useState } from "react";
import Nav from "./Components/shared/Navbar";
import Footer from "./Components/shared/Footer";
import Home from "./pages/Home";
import Aboutus from "./pages/Aboutus";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import LoginForm from "./Components/LoginForm";
import AdminPanel from "./admin/Main/AdminPanel";
import ProtectedRoute from "./Components/ProtectedRoute";
import ChatBox from "./Components/shared/ChatBox";
import Legal from "./pages/Legal";
import Careers from "./pages/Careers";
import FAQ from "./pages/FAQ";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <>
      <SettingsProvider>
        {/* Render Nav only for non-admin pages */}
        {!hideLayout && <Nav />}

        <div className="App">
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

            {/* Fallback route for non-existent paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* ChatBox appears on all pages except admin routes */}
        {!hideLayout && <ChatBox />}

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