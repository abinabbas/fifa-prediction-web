"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, type AdminQuestion } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/admin/login");
      else if (user.role !== "admin") router.push("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      api.getAdminQuestions().then((res) => setQuestions(res.questions)).finally(() => setLoading(false));
    }
  }, [user]);

  const setCorrectAnswer = async (questionId: string, optionId: string) => {
    await api.updateQuestion(questionId, { correctOptionId: optionId });
    const res = await api.getAdminQuestions();
    setQuestions(res.questions);
  };

  const removeQuestion = async (questionId: string, title: string) => {
    if (!confirm(`Remove question "${title}"? All predictions for it will also be deleted.`)) return;

    setRemovingId(questionId);
    try {
      await api.deleteQuestion(questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch {
      alert("Failed to remove question");
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LaunchpadHeader showNav={false} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="label-upper text-orange mb-1">Admin Panel</p>
            <h1 className="text-2xl font-black text-navy">Prediction Results</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="px-4 py-2.5 rounded-lg border border-border text-navy text-sm font-semibold hover:bg-white">
              ← Home
            </Link>
            <Link href="/admin/leaderboard" className="px-4 py-2.5 rounded-lg border border-border text-navy text-sm font-semibold hover:bg-white">
              Leaderboard
            </Link>
            <Link href="/admin/questions/new" className="btn-orange px-4 py-2.5 text-sm">
              + Add Question
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-muted text-center py-12">Loading questions...</p>
        ) : questions.length === 0 ? (
          <div className="launchpad-card p-12 text-center">
            <p className="text-muted mb-4">No questions yet.</p>
            <Link href="/admin/questions/new" className="text-orange font-semibold hover:underline">
              Create your first question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => {
              const isClosed = new Date() >= new Date(q.closesAt);
              const total = q.totalPredictions;

              return (
                <div key={q.id} className="launchpad-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-navy">{q.title}</h3>
                        {q.isActive && (
                          <span className="px-2 py-0.5 text-xs font-black bg-yellow-400 text-yellow-900 rounded-full">ACTIVE</span>
                        )}
                        {isClosed && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-700 rounded-full">CLOSED</span>
                        )}
                      </div>
                      <p className="text-sm text-muted">
                        Closes: {new Date(q.closesAt).toLocaleString()} · {total} prediction{total !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id, q.title)}
                      disabled={removingId === q.id}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 whitespace-nowrap"
                    >
                      {removingId === q.id ? "Removing..." : "Remove question"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {q.options.map((opt) => {
                      const count = q.optionCounts[opt.id] || 0;
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                      const isCorrect = q.correctOptionId === opt.id;

                      return (
                        <div key={opt.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className={`font-semibold ${isCorrect ? "text-orange" : "text-navy"}`}>
                                {opt.label} {isCorrect && "✓"}
                              </span>
                              <span className="text-muted">{count} ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-background rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${isCorrect ? "bg-orange" : "bg-navy/30"}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          {isClosed && !q.correctOptionId && (
                            <button onClick={() => setCorrectAnswer(q.id, opt.id)} className="text-xs px-2 py-1 rounded border border-border hover:bg-background text-muted whitespace-nowrap">
                              Mark correct
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Link
                    href={`/admin/questions/${q.id}/votes`}
                    className="mt-4 inline-block text-sm text-[#f97316] font-semibold hover:underline"
                  >
                    View voters →
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <LaunchpadFooter />
    </div>
  );
}
