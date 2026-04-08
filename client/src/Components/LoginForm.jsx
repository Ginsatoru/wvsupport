import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "./Images/speaking.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ANIM_DURATION = 3000;

const FingerprintSVG = ({ active }) => (
  <svg
    className={`fp fp-${active ? "active" : "base"}`}
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 100 100"
  >
    <g className="fp-out" fill="none" strokeWidth="2" strokeLinecap="round">
      <path className="odd"  d="m 25.117139,57.142857 c 0,0 -1.968558,-7.660465 -0.643619,-13.149003 1.324939,-5.488538 4.659682,-8.994751 4.659682,-8.994751" />
      <path className="odd"  d="m 31.925369,31.477584 c 0,0 2.153609,-2.934998 9.074971,-5.105078 6.921362,-2.17008 11.799844,-0.618718 11.799844,-0.618718" />
      <path className="odd"  d="m 57.131213,26.814448 c 0,0 5.127709,1.731228 9.899495,7.513009 4.771786,5.781781 4.772971,12.109204 4.772971,12.109204" />
      <path className="odd"  d="m 72.334009,50.76769 0.09597,2.298098 -0.09597,2.386485" />
      <path className="even" d="m 27.849282,62.75 c 0,0 1.286086,-1.279223 1.25,-4.25 -0.03609,-2.970777 -1.606117,-7.675266 -0.625,-12.75 0.981117,-5.074734 4.5,-9.5 4.5,-9.5" />
      <path className="even" d="m 36.224282,33.625 c 0,0 8.821171,-7.174484 19.3125,-2.8125 10.491329,4.361984 11.870558,14.952665 11.870558,14.952665" />
      <path className="even" d="m 68.349282,49.75 c 0,0 0.500124,3.82939 0.5625,5.8125 0.06238,1.98311 -0.1875,5.9375 -0.1875,5.9375" />
      <path className="odd"  d="m 31.099282,65.625 c 0,0 1.764703,-4.224042 2,-7.375 0.235297,-3.150958 -1.943873,-9.276886 0.426777,-15.441942 2.370649,-6.165056 8.073223,-7.933058 8.073223,-7.933058" />
      <path className="odd"  d="m 45.849282,33.625 c 0,0 12.805566,-1.968622 17,9.9375 4.194434,11.906122 1.125,24.0625 1.125,24.0625" />
      <path className="even" d="m 59.099282,70.25 c 0,0 0.870577,-2.956221 1.1875,-4.5625 0.316923,-1.606279 0.5625,-5.0625 0.5625,-5.0625" />
      <path className="even" d="m 60.901059,56.286612 c 0,0 0.903689,-9.415996 -3.801777,-14.849112 -3.03125,-3.5 -7.329245,-4.723939 -11.867187,-3.8125 -5.523438,1.109375 -7.570313,5.75 -7.570313,5.75" />
      <path className="even" d="m 34.072577,68.846248 c 0,0 2.274231,-4.165782 2.839205,-9.033748 0.443558,-3.821814 -0.49394,-5.649939 -0.714206,-8.05386 -0.220265,-2.403922 0.21421,-4.63364 0.21421,-4.63364" />
      <path className="odd"  d="m 37.774165,70.831845 c 0,0 2.692139,-6.147592 3.223034,-11.251208 0.530895,-5.103616 -2.18372,-7.95562 -0.153491,-13.647655 2.030229,-5.692035 8.108442,-4.538898 8.108442,-4.538898" />
      <path className="odd"  d="m 54.391174,71.715729 c 0,0 2.359472,-5.427681 2.519068,-16.175068 0.159595,-10.747388 -4.375223,-12.993087 -4.375223,-12.993087" />
      <path className="even" d="m 49.474282,73.625 c 0,0 3.730297,-8.451831 3.577665,-16.493718 -0.152632,-8.041887 -0.364805,-11.869326 -4.765165,-11.756282 -4.400364,0.113044 -3.875,4.875 -3.875,4.875" />
      <path className="even" d="m 41.132922,72.334447 c 0,0 2.49775,-5.267079 3.181981,-8.883029 0.68423,-3.61595 0.353553,-9.413359 0.353553,-9.413359" />
      <path className="odd"  d="m 45.161782,73.75 c 0,0 1.534894,-3.679847 2.40625,-6.53125 0.871356,-2.851403 1.28125,-7.15625 1.28125,-7.15625" />
      <path className="odd"  d="m 48.801947,56.125 c 0,0 0.234502,-1.809418 0.109835,-3.375 -0.124667,-1.565582 -0.5625,-3.1875 -0.5625,-3.1875" />
    </g>
  </svg>
);

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFailed, setScanFailed] = useState(false);

  const [firstOpen, setFirstOpen] = useState(false);
  const hasOpenedRef = useRef(false);
  const pendingLoginRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (!hasOpenedRef.current) {
        setFirstOpen(true);
        hasOpenedRef.current = true;
        setTimeout(() => setFirstOpen(false), 1000);
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setError("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setRememberMe(false);
      setIsScanning(false);
      setScanFailed(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isScanning || isLoading) return;
    setError("");
    setIsScanning(true);

    // kick off API call in background; resolve after animation finishes
    let apiResult = null;
    const apiPromise = (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password: password.trim() }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          return { ok: false, message: d.message || "Login failed" };
        }
        const data = await res.json();
        if (data.token) return { ok: true, token: data.token };
        return { ok: false, message: "No token received" };
      } catch (err) {
        return { ok: false, message: err.message || "Login failed. Please try again." };
      }
    })();

    pendingLoginRef.current = apiPromise;

    // resolve API early so we can show correct icon during animation
    apiPromise.then((result) => {
      if (!result.ok) setScanFailed(true);
    });

    // wait for animation to finish
    setTimeout(async () => {
      setIsScanning(false);
      setScanFailed(false);
      setIsLoading(true);
      try {
        const result = await apiPromise;
        if (result.ok) {
          if (rememberMe) localStorage.setItem("adminToken", result.token);
          else sessionStorage.setItem("adminToken", result.token);
          sessionStorage.setItem("LoginTime", Date.now());
          onLogin();
          onClose();
          navigate("/admin-panel", { state: { fromLogin: true } });
        } else {
          setError(result.message);
        }
      } catch {
        setError("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, ANIM_DURATION);
  };

  if (!isOpen) return null;

  const fo = firstOpen;

  return (
    <>
      <div className="lm-backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className={`lm-modal${fo ? " lm-first-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Login"
      >
        <div className="lm-split">

          <button className="lm-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="lm-left">
            <div className="lm-body lm-fade-in">
              <div className="lm-header">
                <h2 className="lm-title">
                  <span className="lm-dot" />
                  Admin Login
                </h2>
                <p className="lm-subtitle">Welcome back! Please enter your credentials</p>
              </div>

              {error && <div className="lm-error">{error}</div>}

              <form onSubmit={handleLogin} className="lm-form">
                <div className={`lm-group${fo ? " lm-stagger-1" : ""}`}>
                  <label className="lm-label" htmlFor="lm-email">Email</label>
                  <input
                    id="lm-email"
                    type="email"
                    className="lm-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className={`lm-group${fo ? " lm-stagger-2" : ""}`}>
                  <label className="lm-label" htmlFor="lm-password">Password</label>
                  <div className="lm-pw-wrap">
                    <input
                      id="lm-password"
                      type={showPassword ? "text" : "password"}
                      className="lm-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="lm-pw-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password"
                    >
                      {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                    </button>
                  </div>
                </div>

                <div className={`lm-row${fo ? " lm-stagger-3" : ""}`}>
                  <label className="lm-check-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="lm-check"
                    />
                    Keep me logged in
                  </label>
                </div>

                {/* ── Fingerprint submit button ── */}
                <div
                  className={`lm-fp-btn${isScanning ? " lm-fp-active" : ""}${scanFailed ? " lm-fp-failed" : ""}`}
                  onClick={isScanning || isLoading ? undefined : handleLogin}
                  role="button"
                  aria-label="Log in"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLogin(e); }}
                >
                  <span className="lm-fp-text">
                    {isLoading ? <span className="lm-spinner" /> : "Log in"}
                  </span>

                  <FingerprintSVG active={false} />
                  <FingerprintSVG active={true} />

                  {/* success checkmark */}
                  <svg className="lm-fp-ok" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                    <path d="M34.912 50.75l10.89 10.125L67 36.75" fill="none" stroke="#fff" strokeWidth="6" />
                  </svg>

                  {/* failure X */}
                  <svg className="lm-fp-fail" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                    <line x1="35" y1="35" x2="65" y2="65" stroke="#ff4d4d" strokeWidth="6" strokeLinecap="round" />
                    <line x1="65" y1="35" x2="35" y2="65" stroke="#ff4d4d" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </div>
              </form>
            </div>
          </div>

          <div
            className="lm-right"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
      </div>

      <style>{`
        /* ─── Backdrop ─── */
        .lm-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          z-index: 9998;
          animation: lmFadeIn 0.3s ease forwards;
        }

        /* ─── Modal ─── */
        .lm-modal {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) scale(0.96);
          width: 90%; max-width: 900px;
          max-height: 90vh;
          background: #fff;
          border-radius: 24px;
          z-index: 9999;
          overflow: hidden;
          display: flex;
          animation: lmScaleIn 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes lmFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes lmScaleIn {
          from { opacity:0; transform:translate(-50%,-50%) scale(0.95); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }

        /* ─── Split layout ─── */
        .lm-split { display:flex; width:100%; min-height:560px; position:relative; }

        .lm-left {
          flex:0 0 50%; width:50%;
          padding:70px 72px 60px;
          display:flex; flex-direction:column; justify-content:flex-start;
          background:#fff; position:relative;
        }
        .lm-modal.lm-first-open .lm-left {
          opacity:0; transform:translateX(-30px);
          animation:lmSlideLeft 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s forwards;
        }
        @keyframes lmSlideLeft { to { opacity:1; transform:translateX(0); } }

        .lm-right {
          flex:0 0 50%; width:50%;
          background-size:cover; background-position:center; background-repeat:no-repeat;
        }
        .lm-modal.lm-first-open .lm-right {
          opacity:0; transform:translateX(30px);
          animation:lmSlideRight 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s forwards;
        }
        @keyframes lmSlideRight { to { opacity:1; transform:translateX(0); } }

        /* ─── Close ─── */
        .lm-close {
          position:absolute; top:18px; right:18px;
          width:38px; height:38px;
          border:none; background:rgba(0,0,0,0.06);
          border-radius:50%; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          color:#374151; transition:background 0.2s; z-index:10;
        }
        .lm-close:hover { background:rgba(0,0,0,0.12); }
        .lm-modal.lm-first-open .lm-close {
          opacity:0; transform:scale(0.8) rotate(-90deg);
          animation:lmRotateIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.3s forwards;
        }
        @keyframes lmRotateIn { to { opacity:1; transform:scale(1) rotate(0deg); } }

        /* ─── Form body ─── */
        .lm-body { display:flex; flex-direction:column; flex:1; }
        .lm-fade-in { animation:lmFadeSlide 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
        @keyframes lmFadeSlide {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .lm-header {
          margin-bottom:36px; text-align:center;
          padding-bottom:36px; border-bottom:1px solid #f3f4f6;
        }
        .lm-modal.lm-first-open .lm-header {
          opacity:0; transform:translateY(-16px);
          animation:lmFadeDown 0.5s cubic-bezier(0.4,0,0.2,1) 0.3s forwards;
        }
        @keyframes lmFadeDown { to { opacity:1; transform:translateY(0); } }

        .lm-title {
          font-size:1.65rem; font-weight:700; color:#111827;
          margin:0 0 18px;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .lm-dot { width:7px; height:7px; background:#0f8abe; border-radius:50%; flex-shrink:0; }
        .lm-subtitle { font-size:0.85rem; color:#6b7280; margin:0; }

        .lm-error {
          padding:10px 14px; background:#fef2f2;
          border-left:3px solid #ef4444; border-radius:10px;
          color:#991b1b; font-size:0.82rem; margin-bottom:14px;
          animation:lmFadeSlide 0.3s ease forwards;
        }

        .lm-form { display:flex; flex-direction:column; gap:22px; }
        .lm-group { display:flex; flex-direction:column; gap:8px; }

        .lm-modal.lm-first-open .lm-stagger-1 {
          opacity:0; transform:translateY(10px);
          animation:lmFadeUp 0.4s cubic-bezier(0.4,0,0.2,1) 0.4s forwards;
        }
        .lm-modal.lm-first-open .lm-stagger-2 {
          opacity:0; transform:translateY(10px);
          animation:lmFadeUp 0.4s cubic-bezier(0.4,0,0.2,1) 0.5s forwards;
        }
        .lm-modal.lm-first-open .lm-stagger-3 {
          opacity:0; transform:translateY(10px);
          animation:lmFadeUp 0.4s cubic-bezier(0.4,0,0.2,1) 0.6s forwards;
        }
        @keyframes lmFadeUp { to { opacity:1; transform:translateY(0); } }

        .lm-label { font-size:0.85rem; font-weight:600; color:#374151; }
        .lm-input {
          width:100%; padding:10px 14px; font-size:0.9rem;
          border:2px solid #e5e7eb; border-radius:10px;
          background:#fff; color:#111827; outline:none;
          transition:border-color 0.2s, box-shadow 0.2s;
          box-sizing:border-box;
        }
        .lm-input::placeholder { color:#9ca3af; }
        .lm-input:focus { border-color:#d1d5db; box-shadow:none; }

        .lm-pw-wrap { position:relative; }
        .lm-pw-wrap .lm-input { padding-right:44px; }
        .lm-pw-toggle {
          position:absolute; right:12px; top:50%;
          transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#9ca3af; padding:4px;
          display:flex; align-items:center;
          transition:color 0.2s;
        }
        .lm-pw-toggle:hover { color:#374151; }

        .lm-row { display:flex; align-items:center; }
        .lm-check-label {
          display:flex; align-items:center; gap:7px;
          font-size:0.82rem; color:#374151; cursor:pointer;
        }
        .lm-check { width:15px; height:15px; accent-color:#0f8abe; cursor:pointer; }

        /* ─────────────────────────────────────────────
           Fingerprint button — mirrors the original
           vanilla animation exactly
        ───────────────────────────────────────────── */
        .lm-fp-btn {
          align-items: center;
          background: #111827;
          border-radius: 40px;
          cursor: pointer;
          display: flex;
          height: 50px;
          justify-content: center;
          margin-top: 8px;
          outline: none;
          padding: 0 24px;
          position: relative;
          transition: background 0.2s;
          user-select: none;
          width: 100%;
          box-sizing: border-box;
        }
        .lm-fp-btn:hover:not(.lm-fp-active) { background: #374151; }

        /* ── text label ── */
        .lm-fp-text {
          color: #fff;
          font-size: 0.92rem;
          font-weight: 600;
          position: absolute;
          transition: opacity 300ms;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── shared fingerprint SVG styles ── */
        .fp {
          left: -8px;
          opacity: 0;
          position: absolute;
          top: calc(50% - 50px + 9px - 9px);   /* vertically centre the 100px svg in 50px btn */
          transition: opacity 1ms;
          pointer-events: none;
        }
        .fp { top: calc(50% - 30px); left: calc(50% - 30px); width: 60px; height: 60px; }

        .fp-base  { stroke: #777; }
        .fp-active { stroke: #fff; }

        .fp-out { opacity: 1; }

        .fp .odd {
          stroke-dasharray: 0px 50px;
          stroke-dashoffset: 1px;
          transition: stroke-dasharray 1ms;
        }
        .fp .even {
          stroke-dasharray: 50px 50px;
          stroke-dashoffset: -41px;
          transition: stroke-dashoffset 1ms;
        }

        /* ── ok checkmark ── */
        .lm-fp-ok { opacity: 0; position: absolute; top: calc(50% - 30px); left: calc(50% - 30px); width: 60px; height: 60px; pointer-events: none; }

        /* ── fail X ── */
        .lm-fp-fail { opacity: 0; position: absolute; top: calc(50% - 30px); left: calc(50% - 30px); width: 60px; height: 60px; pointer-events: none; }

        /* ══════════════════════════════════════════
           ACTIVE STATE  — all the magic happens here
        ══════════════════════════════════════════ */
        .lm-fp-active {
          animation: 3s fpContainer forwards;
          cursor: default;
        }
        .lm-fp-active .lm-fp-text {
          opacity: 0;
          animation: 3s fpText forwards;
        }
        .lm-fp-active .fp {
          opacity: 1;
          transition: opacity 300ms 200ms;
        }

        /* base fingerprint draws quickly */
        .lm-fp-active .fp-base .odd {
          stroke-dasharray: 50px 50px;
          transition: stroke-dasharray 400ms 50ms;
        }
        .lm-fp-active .fp-base .even {
          stroke-dashoffset: 0px;
          transition: stroke-dashoffset 400ms;
        }

        /* active (white) fingerprint draws slowly — the "scan" */
        .lm-fp-active .fp-active .odd {
          stroke-dasharray: 50px 50px;
          transition: stroke-dasharray 1000ms 750ms;
        }
        .lm-fp-active .fp-active .even {
          stroke-dashoffset: 0px;
          transition: stroke-dashoffset 1000ms 650ms;
        }

        /* both fingerprints fade out after scan */
        .lm-fp-active .fp-out {
          opacity: 0;
          transition: opacity 300ms 2050ms;
        }

        /* checkmark appears (success) */
        .lm-fp-active:not(.lm-fp-failed) .lm-fp-ok {
          opacity: 1;
          animation: 3s fpOk forwards;
        }

        /* X appears (failure) */
        .lm-fp-active.lm-fp-failed .lm-fp-fail {
          opacity: 1;
          animation: 3s fpOk forwards;
        }
        .lm-fp-active.lm-fp-failed .fp-active { stroke: #ff4d4d; }

        /* ── keyframes (identical to original) ── */
        @keyframes fpContainer {
          0%   { width: 100%; border-radius: 40px; }
          6%   { width: 80px; border-radius: 40px; }
          71%  { transform: scale(1); }
          75%  { transform: scale(1.2); }
          77%  { transform: scale(1); }
          94%  { width: 80px; }
          100% { width: 100%; border-radius: 40px; }
        }
        @keyframes fpText {
          0%   { opacity: 1; transform: scale(1); }
          6%   { opacity: 0; transform: scale(0.5); }
          94%  { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fpOk {
          0%   { opacity: 0; }
          70%  { opacity: 0; transform: scale(0); }
          75%  { opacity: 1; transform: scale(1.1); }
          77%  { opacity: 1; transform: scale(1); }
          92%  { opacity: 1; transform: scale(1); }
          96%  { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0; }
        }

        /* ─── Spinner (for post-anim loading fallback) ─── */
        .lm-spinner {
          width:18px; height:18px;
          border:2px solid rgba(255,255,255,0.35);
          border-top-color:#fff;
          border-radius:50%;
          animation:lmSpin 0.6s linear infinite;
        }
        @keyframes lmSpin { to { transform:rotate(360deg); } }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .lm-modal { width:95%; max-width:460px; }
          .lm-split { flex-direction:column; min-height:auto; }
          .lm-left  { flex:1; width:100%; padding:48px 28px 36px; }
          .lm-right { display:none; }
        }
        @media (max-width: 480px) {
          .lm-left { padding:40px 22px 30px; }
        }

        /* ─── Reduced motion ─── */
        @media (prefers-reduced-motion: reduce) {
          .lm-backdrop, .lm-modal, .lm-fade-in,
          .lm-modal.lm-first-open .lm-left,
          .lm-modal.lm-first-open .lm-right,
          .lm-modal.lm-first-open .lm-close,
          .lm-modal.lm-first-open .lm-header,
          .lm-modal.lm-first-open .lm-stagger-1,
          .lm-modal.lm-first-open .lm-stagger-2,
          .lm-modal.lm-first-open .lm-stagger-3,
          .lm-fp-active, .lm-fp-active .lm-fp-text, .lm-fp-active .lm-fp-ok {
            animation: none; opacity: 1; transform: none;
          }
          .lm-fp-active .fp { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default LoginModal;