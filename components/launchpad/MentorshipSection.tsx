"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Users,
  Rocket,
  BadgeCheck,
  Award,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { PageContainer } from "@/components/launchpad/PageContainer";
import { api, type MarqueeTeam } from "@/lib/api";
import { getFlagImageUrl, TEAM_FLAGS } from "@/lib/teamFlags";

const features = [
  {
    Icon: Sparkles,
    tileBg: "#ede9fe",
    iconColor: "#7c3aed",
    title: "AI-Powered Curriculum",
    desc: "AI tools woven into every module – from strategy to content, ads, and analytics.",
  },
  {
    Icon: Users,
    tileBg: "#dbeafe",
    iconColor: "#2563eb",
    title: "1-on-1 Mentorship",
    desc: "Weekly sessions with a senior marketer who reviews your work and guides your growth.",
  },
  {
    Icon: Rocket,
    tileBg: "#ffedd5",
    iconColor: "#ea580c",
    title: "Live Project Execution",
    desc: "Run real campaigns on real brands – build a portfolio while you learn, not after.",
  },
  {
    Icon: BadgeCheck,
    tileBg: "#d1fae5",
    iconColor: "#059669",
    title: "100% Placement Assistance",
    desc: "Portfolio reviews, mock interviews, and a team that stays with you until you land a job.",
  },
  {
    Icon: Award,
    tileBg: "#fef9c3",
    iconColor: "#ca8a04",
    title: "Industry Certificate",
    desc: "Graduate with a verified credential recognized across digital marketing and AI roles.",
  },
  {
    Icon: TrendingUp,
    tileBg: "#fce7f3",
    iconColor: "#db2777",
    title: "Career-Ready Skills",
    desc: "Graduate job-ready with skills in SEO, Meta Ads, Google Ads, content, and automation.",
  },
];

const stats = [
  { value: "100%", label: "Scholarship" },
  { value: "10 Winners", label: "Scholarship Seats" },
  { value: "Daily", label: "Prediction Challenges" },
];

const FALLBACK_MARQUEE_TEAMS: MarqueeTeam[] = TEAM_FLAGS.map((team) => ({
  code: team.code,
  iso: team.iso,
  label: team.name,
}));

function expandMarqueeTeams(teams: MarqueeTeam[], minItems = 32): MarqueeTeam[] {
  if (teams.length === 0) return [];
  const expanded: MarqueeTeam[] = [];
  for (let i = 0; i < minItems; i += 1) {
    expanded.push(teams[i % teams.length]);
  }
  return expanded;
}

export function MentorshipSection() {
  const [marqueeTeams, setMarqueeTeams] = useState<MarqueeTeam[]>(FALLBACK_MARQUEE_TEAMS);

  useEffect(() => {
    api
      .getMarqueeTeams()
      .then((res) => {
        if (res.teams.length > 0) setMarqueeTeams(res.teams);
      })
      .catch(() => {
        setMarqueeTeams(FALLBACK_MARQUEE_TEAMS);
      });
  }, []);

  const scrollToPredict = () => {
    document.getElementById("predict")?.scrollIntoView({ behavior: "smooth" });
  };

  const loopTeams = expandMarqueeTeams(marqueeTeams);

  return (
    <section className="overflow-x-clip pb-0 pt-8 sm:pt-16" id="prize" style={{ backgroundColor: "#fafafa" }}>
      <PageContainer>
        <div
          className="rounded-3xl p-4 sm:p-10 lg:p-12 shadow-xl"
          style={{ backgroundColor: "#312e81" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left column — mobile order: heading → yellow badge → description; desktop: description → yellow badge */}
            <div className="flex flex-col items-start">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                <Zap className="w-3 h-3" style={{ color: "#facc15" }} />
                Every Prediction Builds Your Future
              </span>

              <p className="mt-5 lg:mt-7 text-base sm:text-lg font-semibold" style={{ color: "#fb923c" }}>
                More Than Just a Prize, What You&apos;ll Unlock ?
              </p>

              <h2 className="mt-3 text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.15]">
                AI-Integrated Digital Marketing Mentorship Program
              </h2>

              <p
                className="mt-6 hidden lg:block text-sm sm:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Every prediction gives you a chance to unlock opportunities beyond prizes. Top
                participants can earn scholarships, mentorship access, industry recognition, and a
                pathway into AI-integrated Digital Marketing.
              </p>

              <div
                className="mt-8 lg:mt-10 self-center inline-flex items-center gap-2 rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-extrabold"
                style={{ backgroundColor: "#facc15", color: "#1e293b" }}
              >
                <Trophy className="w-4 h-4" />
                Course Worth ₹1,50,000
              </div>

              <span
                className="mt-4 self-center inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold text-white"
                style={{ border: "1px solid rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                Exclusively Awarded to 10 Winners
              </span>

              <p
                className="mt-5 lg:hidden text-sm sm:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                Every prediction gives you a chance to unlock opportunities beyond prizes. Top
                participants can earn scholarships, mentorship access, and a pathway into
                AI-integrated Digital Marketing.
              </p>

              {/* Desktop button (mobile version is below the feature cards) */}
              <button
                type="button"
                onClick={scrollToPredict}
                className="hidden lg:inline-block mt-12 self-center text-white text-sm sm:text-base font-bold px-12 py-4 rounded-full transition-colors hover:brightness-95 shadow-lg"
                style={{ backgroundColor: "#f97316" }}
              >
                Start Predicting
              </button>
            </div>

            {/* Right column: feature cards — compact icon+title on mobile, full card on desktop */}
            <div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-5">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-xl sm:rounded-2xl p-2.5 sm:p-5 lg:p-6 flex items-center gap-2 sm:gap-3 lg:block min-w-0"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 lg:mb-4"
                      style={{ backgroundColor: f.tileBg }}
                    >
                      <f.Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" style={{ color: f.iconColor }} />
                    </div>
                    <h3 className="text-xs sm:text-sm lg:text-[15px] font-bold text-white leading-snug lg:mb-2 min-w-0">
                      {f.title}
                    </h3>
                    <p
                      className="hidden lg:block text-xs lg:text-[13px] leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.62)" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile button — full width, below the cards */}
              <button
                type="button"
                onClick={scrollToPredict}
                className="lg:hidden mt-6 w-full text-white text-base font-bold py-4 rounded-full transition-colors hover:brightness-95 shadow-lg"
                style={{ backgroundColor: "#f97316" }}
              >
                Start Predicting
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-6 rounded-2xl px-4 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:py-8"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center divide-x divide-slate-200">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-base sm:text-xl font-extrabold" style={{ color: "#1e293b" }}>
                  {s.value}
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>

      {/* Full-bleed marquee — sits flush against Prediction Hub below */}
      <div className="flag-marquee-outer w-full">
        <div className="flag-marquee-inner">
          <div className="flag-marquee-viewport">
            <div className="flag-marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flag-marquee-group" aria-hidden={copy === 1 ? true : undefined}>
                  {loopTeams.map((team, index) => (
                    <div key={`${copy}-${team.iso}-${index}`} className="flag-marquee-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getFlagImageUrl(team.iso)}
                        alt={copy === 0 ? `${team.code} flag` : ""}
                        width={20}
                        height={20}
                        className="h-5 w-5 shrink-0 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-bold tracking-wide text-white sm:text-xs">
                        {team.code}
                      </span>
                      <span className="text-[10px] text-white/50" aria-hidden="true">
                        •
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
