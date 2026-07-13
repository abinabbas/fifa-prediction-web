"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, type LeaderboardEntry } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";

const PAGE_SIZE = 10;

function formatPhone(phone: string) {
  if (phone.length === 10) return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  if (phone.length === 12 && phone.startsWith("91")) {
    return `+91 ${phone.slice(2, 7)} ${phone.slice(7)}`;
  }
  return phone;
}

function showValue(value?: string) {
  return value?.trim() ? value : "—";
}

export default function AdminLeaderboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/admin/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role !== "admin") return;

    api
      .getLeaderboard()
      .then((res) => {
        setLeaderboard(res.leaderboard);
        setTotalQuestions(res.totalQuestions);
        setPage(1);
      })
      .catch(() => setError("Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, [user]);

  const totalPages = Math.max(1, Math.ceil(leaderboard.length / PAGE_SIZE));
  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return leaderboard.slice(start, start + PAGE_SIZE);
  }, [leaderboard, page]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <LaunchpadHeader showNav={false} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#1a2b4b] hover:text-[#f97316] transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#f97316] mb-1">
            Admin leaderboard
          </p>
          <h1 className="text-2xl font-bold text-[#1a2b4b] mb-2">Top predictors</h1>
          <p className="text-sm text-slate-500">
            Ranked by most predictions submitted
            {totalQuestions > 0 &&
              ` · ${totalQuestions} total question${totalQuestions !== 1 ? "s" : ""}`}
          </p>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-16">Loading leaderboard...</p>
        ) : error ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500">{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500">
              No predictions yet. Leaderboard will appear once users start predicting.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-[#1a2b4b] text-white text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-3.5 w-14">Rank</th>
                    <th className="px-4 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Mobile</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Interested In</th>
                    <th className="px-4 py-3.5">Expected Salary</th>
                    <th className="px-4 py-3.5 text-center">Predictions</th>
                    <th className="px-4 py-3.5 text-center">Correct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageRows.map((row, index) => {
                    const rank = (page - 1) * PAGE_SIZE + index + 1;
                    return (
                      <tr key={row.userId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-xs font-bold ${
                              rank === 1
                                ? "bg-yellow-400 text-yellow-900"
                                : rank === 2
                                  ? "bg-slate-300 text-slate-800"
                                  : rank === 3
                                    ? "bg-orange-200 text-orange-900"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {rank}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#1a2b4b]">{row.fullName}</td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {formatPhone(row.phone)}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{row.email}</td>
                        <td className="px-4 py-3.5 text-slate-600">{showValue(row.interestedIn)}</td>
                        <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                          {showValue(row.expectedSalary)}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex min-w-[2rem] justify-center px-2.5 py-1 rounded-md bg-[#f97316]/10 text-[#f97316] font-bold text-xs">
                            {row.predictionCount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex min-w-[2rem] justify-center px-2.5 py-1 rounded-md bg-green-100 text-green-700 font-bold text-xs">
                            {row.correctCount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 px-4 py-4">
              <p className="text-xs text-slate-500">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, leaderboard.length)} of {leaderboard.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1a2b4b] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-slate-600">
                  Page {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1a2b4b] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <LaunchpadFooter />
    </div>
  );
}
