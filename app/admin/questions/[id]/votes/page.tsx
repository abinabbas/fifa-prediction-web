"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api, type PredictionRow, type QuestionResults } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";

type ResultFilter = "all" | "correct" | "incorrect";
type TimeSort = "desc" | "asc";

function formatPhone(phone: string) {
  if (phone.length === 10) return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  if (phone.length === 12 && phone.startsWith("91")) {
    return `+91 ${phone.slice(2, 7)} ${phone.slice(7)}`;
  }
  return phone;
}

export default function QuestionVotesPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<QuestionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const [timeSort, setTimeSort] = useState<TimeSort>("desc");

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/admin/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role !== "admin" || !questionId) return;

    api
      .getQuestionResults(questionId)
      .then(setResults)
      .catch(() => setError("Failed to load predictions"))
      .finally(() => setLoading(false));
  }, [user, questionId]);

  const question = results?.question;
  const predictions = results?.predictions ?? [];
  const correctLabel = question?.options.find((o) => o.id === question?.correctOptionId)?.label;
  const hasCorrectAnswer = Boolean(question?.correctOptionId);

  const filteredPredictions = useMemo(() => {
    let rows: PredictionRow[] = [...predictions];

    if (hasCorrectAnswer && resultFilter === "correct") {
      rows = rows.filter((row) => row.isCorrect === true);
    } else if (hasCorrectAnswer && resultFilter === "incorrect") {
      rows = rows.filter((row) => row.isCorrect === false);
    }

    rows.sort((a, b) => {
      const diff = new Date(a.predictedAt).getTime() - new Date(b.predictedAt).getTime();
      return timeSort === "asc" ? diff : -diff;
    });

    return rows;
  }, [predictions, hasCorrectAnswer, resultFilter, timeSort]);

  const filterBtnClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      active
        ? "bg-[#1a2b4b] text-white"
        : "bg-white text-slate-600 border border-slate-200 hover:border-[#1a2b4b]/30"
    }`;

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
            ← Back to results
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500 text-center py-16">Loading predictions...</p>
        ) : error || !question ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500">{error || "Question not found"}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#f97316] mb-1">
                All predictions
              </p>
              <h1 className="text-2xl font-bold text-[#1a2b4b] mb-2">{question.title}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
                <span>Closes: {new Date(question.closesAt).toLocaleString()}</span>
                <span>{predictions.length} prediction{predictions.length !== 1 ? "s" : ""}</span>
                {correctLabel && (
                  <span className="text-[#f97316] font-semibold">Correct: {correctLabel}</span>
                )}
              </div>
            </div>

            {predictions.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Filter & sort
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Result:</span>
                    <button
                      type="button"
                      onClick={() => setResultFilter("all")}
                      className={filterBtnClass(resultFilter === "all")}
                    >
                      All ({predictions.length})
                    </button>
                    {hasCorrectAnswer ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setResultFilter("correct")}
                          className={filterBtnClass(resultFilter === "correct")}
                        >
                          Correct ({predictions.filter((p) => p.isCorrect).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setResultFilter("incorrect")}
                          className={filterBtnClass(resultFilter === "incorrect")}
                        >
                          Incorrect ({predictions.filter((p) => p.isCorrect === false).length})
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Mark correct answer to filter by result</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Time:</span>
                    <button
                      type="button"
                      onClick={() => setTimeSort("desc")}
                      className={filterBtnClass(timeSort === "desc")}
                    >
                      Newest first
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeSort("asc")}
                      className={filterBtnClass(timeSort === "asc")}
                    >
                      Oldest first
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Showing {filteredPredictions.length} of {predictions.length} predictions
                </p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {predictions.length === 0 ? (
                <p className="text-slate-500 text-center py-16">No predictions yet</p>
              ) : filteredPredictions.length === 0 ? (
                <p className="text-slate-500 text-center py-16">No predictions match this filter</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-[#1a2b4b] text-white text-[10px] font-bold uppercase tracking-wider">
                        <th className="px-4 py-3.5 w-12">#</th>
                        <th className="px-4 py-3.5">Name</th>
                        <th className="px-4 py-3.5">Phone</th>
                        <th className="px-4 py-3.5">Email</th>
                        <th className="px-4 py-3.5">College</th>
                        <th className="px-4 py-3.5">District</th>
                        <th className="px-4 py-3.5">Prediction</th>
                        <th className="px-4 py-3.5">Submitted</th>
                        {question.correctOptionId && <th className="px-4 py-3.5">Result</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPredictions.map((row, index) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3.5 text-slate-400 font-medium">{index + 1}</td>
                          <td className="px-4 py-3.5 font-semibold text-[#1a2b4b]">{row.fullName}</td>
                          <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                            {formatPhone(row.phone)}
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{row.email}</td>
                          <td className="px-4 py-3.5 text-slate-600">{row.college}</td>
                          <td className="px-4 py-3.5 text-slate-600">{row.district}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-[#eef1f6] text-[#1a2b4b] font-semibold text-xs">
                              {row.selectedOptionLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                            {new Date(row.predictedAt).toLocaleString()}
                          </td>
                          {question.correctOptionId && (
                            <td className="px-4 py-3.5">
                              {row.isCorrect ? (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                  Correct
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                  Wrong
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <LaunchpadFooter />
    </div>
  );
}
