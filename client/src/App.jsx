import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import initTracker from "../utils/tracker";
import { SettingsProvider } from "./context/SettingsContext";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Aboutus from "./Components/Aboutus";
import Contact from "./Components/Contact";
import Project from "./Components/Projects";
import Pages from "./Components/Pages";
import Support from "./Components/Support";
import Services from "./Components/Services";
import Whoweare from "./Components/Whoweare";
import LoginForm from "./Components/LoginForm";
import AdminPanel from "./admin/Main/AdminPanel";
import ProtectedRoute from "./Components/ProtectedRoute";
import ChatBox from "./Components/ChatBox";
import Legal from "./Components/Legal";
import Careers from "./Components/Careers";
import Partner from "./Components/Partner";
import FAQ from "./Components/FAQ";
import POS from "./Components/POS";
import Remote from "./Components/Remote";
import Software from "./Components/Software";
import Integration from "./Components/Integration";
import Networking from "./Components/Networking";
import Training from "./Components/Training";
import Retailmanager from "./Components/RetailManager";
// import Plans from "./Components/Plans";
// import ITsupport from "./Components/ITsupport";
// import Payment from "./Components/Payment"; // Assuming this is the correct path for
// import WebDevelopment from "./Components/WebDevelopment";
// import MobileApp from "./Components/MobileAppDevelopmentPage";
// import UIDesign from "./Components/UIDesign";
// import WordPress from "./Components/WordPress";
// import WebHosting from "./Components/WebHosting";

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Define paths where Nav, Footer, and ChatBox should be hidden
  const hideLayoutPaths = ["/admin", "/admin/login", "/admin-panel"];
  const hideLayout = hideLayoutPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    initTracker(); // Initialize the analytics tracker
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
            <Route path="/project" element={<Project />} />
            <Route path="/pages" element={<Pages />} />
            <Route path="/support" element={<Support />} />
            <Route path="/services" element={<Services />} />
            <Route path="/whoweare" element={<Whoweare />} />
            <Route path="/Legal" element={<Legal />} />
            <Route path="/Careers" element={<Careers />} />
            <Route path="/Partner" element={<Partner />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/remote" element={<Remote />} />
            <Route path="/software" element={<Software />} />
            <Route path="/integrations" element={<Integration />} />
            <Route path="/networking" element={<Networking />} />
            <Route path="/training" element={<Training />} />
            <Route path="/retailmanager" element={<Retailmanager />} />
            {/* <Route path="/Plans" element={<Plans />} /> */}
            {/* <Route path="/itsupport" element={<ITsupport />} /> */}
            {/* <Route path="/payment" element={<Payment />} /> */}
            {/* <Route path="/mobile-app-development" element={<MobileApp />} /> */}
            {/* <Route path="/web-development" element={<WebDevelopment />} /> */}
            {/* <Route path="/ui-design" element={<UIDesign />} />
            <Route path="/wordpress" element={<WordPress />} />
            <Route path="/web-hosting" element={<WebHosting />} /> */}

            {/* Admin routes */}
            <Route
              path="/admin/login"
              element={<LoginForm onLogin={() => setIsAuthenticated(true)} />}
            />
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute>
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
