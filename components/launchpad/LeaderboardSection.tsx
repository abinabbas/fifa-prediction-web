"use client";

import { useEffect, useState } from "react";
import { MapPin, Sparkles, Trophy, Users } from "lucide-react";
import { api, type User } from "@/lib/api";
import { getFlagImageUrl } from "@/lib/teamFlags";
import { PageContainer } from "@/components/launchpad/PageContainer";

const QUARTER_FINALS = [
  {
    match: "01",
    home: { iso: "fr", name: "FRANCE" },
    away: { iso: "ma", name: "MOROCCO" },
    date: "10 JULY 2026 1:30 AM",
    venue: "Boston Stadium",
  },
  {
    match: "02",
    home: { iso: "es", name: "SPAIN" },
    away: { iso: "be", name: "BELGIUM" },
    date: "11 JULY 2026 12:30 AM",
    venue: "Los Angeles Stadium",
  },
  {
    match: "03",
    home: { iso: "no", name: "NORWAY" },
    away: { iso: "gb-eng", name: "ENGLAND" },
    date: "12 JULY 2026 2:30 AM",
    venue: "Miami Stadium",
  },
  {
    match: "04",
    home: { iso: "ar", name: "ARGENTINA" },
    away: { iso: "ch", name: "SWITZERLAND" },
    date: "12 JULY 2026 6:30 PM",
    venue: "New York Stadium",
  },
];

function formatParticipants(count: number | null | undefined): string {
  if (count == null) return "10K+";
  if (count >= 10000) return `${Math.floor(count / 1000)}K+`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return String(count);
}

export function LeaderboardSection({ user }: { user: User | null }) {
  const [totalParticipants, setTotalParticipants] = useState<number | null>(null);
  const [showRank, setShowRank] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const publicRes = await api.getPublicLeaderboard();
        if (!cancelled) {
          setTotalParticipants(publicRes.totalParticipants);
          setShowRank(publicRes.showRank);
        }
      } catch {
        if (!cancelled) {
          setTotalParticipants(null);
          setShowRank(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const participantLabel = formatParticipants(totalParticipants);
  const rankLabel = loading ? "..." : "—";

  return (
    <section className="bg-[#fafafa] py-8 sm:py-12" id="leaderboard">
      <PageContainer>
        {/* Ranking Board */}
        <div className="mb-10 sm:mb-14">
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fef3c7]">
              <Trophy className="h-5 w-5 text-[#d97706]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1a2b4b] sm:text-3xl">Ranking Board</h2>
            <p className="mt-1 text-sm text-slate-500">See where you stand among all participants.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center shadow-sm">
              <Trophy className="mx-auto mb-3 h-6 w-6 text-[#d97706]" />
              <p className="text-3xl font-extrabold tracking-tight text-[#1a2b4b] sm:text-4xl">
                {rankLabel}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Your Rank</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-7 text-center shadow-sm">
              <Users className="mx-auto mb-3 h-6 w-6 text-[#2563eb]" />
              <p className="text-3xl font-extrabold tracking-tight text-[#2563eb] sm:text-4xl">
                {loading ? "..." : participantLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2563eb]/80">Total Participants</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3.5 sm:px-5">
            <Sparkles className="h-4 w-4 shrink-0 text-[#d97706]" />
            <p className="text-sm text-[#9a3412]">
              {!showRank ? (
                <>
                  Match results are being verified — rankings will be updated after screening. Keep
                  predicting to stay in the running among {participantLabel} participants!
                </>
              ) : !user ? (
                <>
                  Join {participantLabel} participants — register and submit your first prediction to
                  appear on the board!
                </>
              ) : (
                <>
                  Keep predicting among {participantLabel} participants — final rankings will be
                  announced after screening!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Quarter-Finals */}
        <div>
          <h3 className="mb-5 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-[#1a2b4b] sm:mb-6">
            Quarter-Finals
          </h3>

          <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 xl:grid-cols-4">
            {QUARTER_FINALS.map((match) => (
              <article
                key={match.match}
                className="relative rounded-2xl border-2 border-[#93c5fd] bg-white px-4 pb-5 pt-8 shadow-sm"
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a] px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Match {match.match}
                </span>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getFlagImageUrl(match.home.iso)}
                      alt={`${match.home.name} flag`}
                      className="h-11 w-11 rounded-full object-cover shadow-md"
                    />
                    <p className="text-center text-[11px] font-extrabold leading-tight text-[#1a2b4b]">
                      {match.home.name}
                    </p>
                  </div>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                    vs
                  </span>

                  <div className="flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getFlagImageUrl(match.away.iso)}
                      alt={`${match.away.name} flag`}
                      className="h-11 w-11 rounded-full object-cover shadow-md"
                    />
                    <p className="text-center text-[11px] font-extrabold leading-tight text-[#1a2b4b]">
                      {match.away.name}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] font-bold uppercase tracking-wide text-[#0284c7]">
                  {match.date}
                </p>

                <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  <span>{match.venue}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
