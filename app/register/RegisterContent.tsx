"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "@/components/launchpad/HeroSection";
import { RegisterForm } from "@/components/launchpad/RegisterForm";
import { LoginForm } from "@/components/launchpad/LoginForm";
import { LaunchpadLogo } from "@/components/launchpad/LaunchpadLogo";

type Side = "register" | "login";

function PitchLines() {
  return (
    <svg
      viewBox="0 0 480 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 h-full w-full opacity-[0.08] pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <line x1="240" y1="0" x2="240" y2="64" stroke="white" strokeWidth="1.5" />
      <circle cx="240" cy="64" r="44" stroke="white" strokeWidth="1.5" />
      <rect x="0" y="12" width="72" height="40" stroke="white" strokeWidth="1.5" />
      <rect x="408" y="12" width="72" height="40" stroke="white" strokeWidth="1.5" />
      <rect x="0" y="22" width="26" height="20" stroke="white" strokeWidth="1.5" />
      <rect x="454" y="22" width="26" height="20" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function CardBanner({ title }: { title: string }) {
  return (
    <div className="relative overflow-hidden" style={{ height: "110px" }}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 480 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="orangeGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <polygon points="0,0 270,0 210,110 0,110" fill="url(#blueGrad)" />
        <polygon points="270,0 480,0 480,110 210,110" fill="url(#orangeGrad)" />
      </svg>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ clipPath: "polygon(0 0, 56.25% 0, 43.75% 100%, 0 100%)" }}
      >
        <PitchLines />
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ clipPath: "polygon(56.25% 0, 100% 0, 100% 100%, 43.75% 100%)" }}
      >
        <PitchLines />
      </div>

      <div className="absolute left-0 top-0 flex h-full w-[42%] flex-col items-center justify-center gap-1">
        <span className="ball-bounce select-none text-3xl" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>⚽</span>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-blue-100"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          Register
        </span>
      </div>

      <div className="absolute right-0 top-0 flex h-full w-[42%] flex-col items-center justify-center gap-1">
        <span className="ball-bounce-delay select-none text-3xl" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>⚽</span>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-100"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          Predict
        </span>
      </div>

      <div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.6))" }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center bg-white"
          style={{ clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}
        >
          <span
            className="text-[14px] font-black italic leading-none"
            style={{
              background: "linear-gradient(160deg,#1d4ed8 40%,#f97316 60%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VS
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <h2
          className="text-[12px] font-black uppercase italic tracking-[0.2em] text-white"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}
        >
          {title}
        </h2>
      </div>
    </div>
  );
}

function StatBar() {
  return (
    <div className="flex divide-x divide-orange-100 border-b border-orange-100 bg-orange-50/60">
      {[
        { icon: "🏆", label: "Win Prizes" },
        { icon: "📊", label: "Live Leaderboard" },
        { icon: "⚡", label: "Instant Access" },
      ].map(({ icon, label }) => (
        <div key={label} className="flex flex-1 items-center justify-center gap-1.5 py-2.5">
          <span className="text-sm">{icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#1a2b4b]/60">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const initialSide: Side =
    searchParams.get("tab") === "login" ? "login" : "register";
  const [side, setSide] = useState<Side>(initialSide);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/home");
  }, [loading, user, router]);

  useEffect(() => {
    const paramSide = searchParams.get("tab") === "login" ? "login" : "register";
    if (paramSide !== side) flip(paramSide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function flip(next?: Side) {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => setSide(next ?? (side === "register" ? "login" : "register")), 300);
    setTimeout(() => setFlipping(false), 620);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef1f6]">
        <span className="inline-block animate-spin text-2xl">⚽</span>
      </div>
    );
  }

  if (user) return null;

  return (
    <>
      <style>{`
        @keyframes fb-bounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          40%       { transform: translateY(-9px) rotate(-18deg); }
          60%       { transform: translateY(-5px) rotate(10deg); }
        }
        @keyframes fb-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .ball-bounce       { display:inline-block; animation: fb-bounce 1.5s ease-in-out infinite; }
        .ball-bounce-delay { display:inline-block; animation: fb-bounce 1.5s ease-in-out 0.75s infinite; }

        @keyframes hype-slide-left {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes hype-expand {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        .flip-wrapper { perspective: 1400px; }
        .flip-card {
          transition: transform 0.62s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }
        .flip-card.is-flipping { transform: rotateY(90deg) scale(0.97); }
      `}</style>

      <div className="min-h-screen bg-[#eef1f6]">

        {/* Header */}
        <header className="border-b border-slate-100 bg-[#fafafa]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <LaunchpadLogo />
            {side === "register" ? (
              <button
                onClick={() => flip("login")}
                className="rounded-lg border border-[#1a2b4b] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#1a2b4b] transition-colors hover:bg-[#1a2b4b] hover:text-white sm:px-4"
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => flip("register")}
                className="rounded-lg border border-[#f97316] px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#f97316] transition-colors hover:bg-[#f97316] hover:text-white sm:px-4"
              >
                Register
              </button>
            )}
          </div>
        </header>

        {/* Hero */}
        <HeroSection ctaLabel="Register Now" scrollTargetId="auth-form" />

        {/* Hype banner */}
        <div className="overflow-hidden bg-white px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div
              className="mb-1 flex items-center gap-2"
              style={{ animation: "hype-slide-left 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <span className="h-[3px] w-6 rounded-full bg-[#f97316]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f97316]">
                FIFA World Cup 2026 Prediction
              </p>
            </div>
            <div style={{ animation: "hype-slide-left 0.75s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}>
              <h2 className="text-2xl font-black uppercase italic leading-tight tracking-tight text-[#1a2b4b] sm:text-3xl">
                It&apos;s Your Turn{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#f97316]">to Predict.</span>
                  <span
                    className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-[#f97316]/30"
                    style={{ animation: "hype-expand 0.6s 0.6s ease both" }}
                  />
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Auth section */}
        <section id="auth-form" className="relative overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
          <span className="pointer-events-none absolute -top-4 left-[3%] select-none text-6xl opacity-[0.055]"
            style={{ animation: "fb-spin-slow 20s linear infinite" }}>⚽</span>
          <span className="pointer-events-none absolute top-8 right-[4%] select-none text-5xl opacity-[0.055]"
            style={{ animation: "fb-spin-slow 26s linear infinite reverse" }}>⚽</span>
          <span className="pointer-events-none absolute bottom-6 left-[7%] select-none text-4xl opacity-[0.055]"
            style={{ animation: "fb-spin-slow 22s linear infinite" }}>🏆</span>
          <span className="pointer-events-none absolute bottom-4 right-[6%] select-none text-5xl opacity-[0.055]"
            style={{ animation: "fb-spin-slow 18s linear infinite reverse" }}>⚽</span>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #f97316 0%, transparent 70%)" }}
          />

          <div className="flip-wrapper mx-auto w-full max-w-2xl">
            <div className={`flip-card${flipping ? " is-flipping" : ""}`}>
              <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_8px_40px_rgba(249,115,22,0.13)]">

                {side === "register" ? (
                  <>
                    <CardBanner title="Player Registration" />
                    <StatBar />
                    <div className="p-6 sm:p-8">
                      <RegisterForm
                        onSuccessRedirect="/home"
                        submitLabel="Register Now"
                        onSwitchTab={() => flip("login")}
                      />
                      <button
                        type="button"
                        onClick={() => flip("login")}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#1a2b4b] bg-white py-3.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#1a2b4b] transition-all hover:bg-[#1a2b4b] hover:text-white"
                      >
                        🏆 Already Participated? Submit Prediction
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <CardBanner title="Submit Prediction" />
                    <StatBar />
                    <div className="p-6 sm:p-8">
                      <LoginForm onSwitchTab={() => flip("register")} />
                      <button
                        type="button"
                        onClick={() => flip("register")}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#1a2b4b] bg-white py-3.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#1a2b4b] transition-all hover:bg-[#1a2b4b] hover:text-white"
                      >
                        ⚽ New here? Register Now
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
