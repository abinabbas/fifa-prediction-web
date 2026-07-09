"use client";

import { useEffect, useState } from "react";
import { Trophy, Users } from "lucide-react";
import { api, type User, type UserLeaderboardResponse } from "@/lib/api";
import { PageContainer } from "@/components/launchpad/PageContainer";

export function LeaderboardSection({ user }: { user: User | null }) {
  const [data, setData] = useState<UserLeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .getUserLeaderboard()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        /* leaderboard is non-critical; hide on failure */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || loading || !data) return null;

  return (
    <section className="py-8 sm:py-16 bg-white" id="leaderboard">
      <PageContainer>
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ranking Board
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            See where you stand among all participants.
          </p>
        </div>

        {/* Your rank + stats */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 mb-6 sm:mb-8 max-w-xl mx-auto">
          <div className="rounded-2xl border border-slate-200 bg-[#fafafa] p-3.5 sm:p-5 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1.5" style={{ color: "#f97316" }} />
            <p className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {data.you ? `#${data.you.rank}` : "—"}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Your Rank</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#fafafa] p-3.5 sm:p-5 text-center">
            <Users className="w-5 h-5 mx-auto mb-1.5" style={{ color: "#2563eb" }} />
            <p className="text-lg sm:text-2xl font-extrabold text-slate-900">
              {data.totalParticipants}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Participants</p>
          </div>
        </div>

        {!data.you ? (
          <p className="text-center text-sm text-slate-500">
            You haven&apos;t made any predictions yet — submit one to enter the ranking!
          </p>
        ) : (
          <p className="text-center text-sm text-slate-500">
            You&apos;re ranked <span className="font-bold text-slate-800">#{data.you.rank}</span> out
            of {data.totalParticipants} participants — keep predicting to climb the board!
          </p>
        )}
      </PageContainer>
    </section>
  );
}
