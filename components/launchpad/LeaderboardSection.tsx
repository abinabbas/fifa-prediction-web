"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Users } from "lucide-react";
import { api, type User } from "@/lib/api";
import { PageContainer } from "@/components/launchpad/PageContainer";

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
            <div className="rounded-2xl bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <Trophy className="mx-auto mb-3 h-6 w-6 text-[#d97706]" />
              <p className="text-3xl font-extrabold tracking-tight text-[#1a2b4b] sm:text-4xl">
                {rankLabel}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Your Rank</p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <Users className="mx-auto mb-3 h-6 w-6 text-[#2563eb]" />
              <p className="text-3xl font-extrabold tracking-tight text-[#2563eb] sm:text-4xl">
                {loading ? "..." : participantLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#2563eb]/80">Total Participants</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#fffbeb] px-4 py-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:px-5">
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

      </PageContainer>
    </section>
  );
}
