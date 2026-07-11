"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trophy } from "lucide-react";
import { api, ApiError, type Question, type QuestionOption, type User } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { CountdownTimer } from "@/components/CountdownTimer";
import { getFlagImageUrl, getTeamFlagByIso } from "@/lib/teamFlags";

const PLAYER_IMAGE =
  "https://res.cloudinary.com/delrmm6pq/image/upload/v1783607493/5690a9c7e1354ce755d4eac2e7897c8804901a28_khx8gh.png";

const TEAM_GLOWS = ["0 0 28px rgba(59, 130, 246, 0.55)", "0 0 28px rgba(239, 68, 68, 0.55)"];

interface PredictionHubProps {
  user: User | null;
}

interface QuestionCardProps {
  question: Question;
  serverTime: string;
  prediction: { selectedOptionId: string; createdAt: string } | null;
  onSubmitted: () => void;
  showPlayer?: boolean;
  user: User | null;
}

function getTeamDisplayName(option: QuestionOption): string {
  if (option.flagIso) {
    const team = getTeamFlagByIso(option.flagIso);
    if (team) return team.name.toUpperCase();
  }
  if (option.flagCode) return option.flagCode;
  return option.label.replace(/\s*win\s*/i, "").trim().toUpperCase();
}

function splitMatchOptions(options: QuestionOption[]) {
  const flagged = options.filter((option) => option.flagIso);
  const neutral = options.filter((option) => !option.flagIso);

  return {
    homeTeam: flagged[0] ?? null,
    awayTeam: flagged.length > 1 ? flagged[flagged.length - 1] : null,
    neutralOptions: neutral,
  };
}

function TeamPick({
  option,
  glow,
  selected,
  disabled,
  onSelect,
}: {
  option: QuestionOption;
  glow: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`flex flex-1 flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-5 transition-all disabled:cursor-default sm:px-4 sm:py-6 ${
        selected
          ? "border-[#f97316] ring-2 ring-[#f97316] shadow-[0_12px_32px_rgba(249,115,22,0.28)]"
          : "shadow-[0_12px_28px_rgba(15,23,42,0.1)] hover:border-slate-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.14)]"
      }`}
    >
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white sm:h-[4.5rem] sm:w-[4.5rem]"
        style={{ boxShadow: glow }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getFlagImageUrl(option.flagIso!)}
          alt={`${getTeamDisplayName(option)} flag`}
          className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
        />
      </div>
      <span className="text-center text-[11px] font-extrabold tracking-wide text-[#1a2b4b] sm:text-xs">
        {getTeamDisplayName(option)}
      </span>
    </button>
  );
}

function QuestionCard({
  question,
  serverTime,
  prediction,
  onSubmitted,
  showPlayer,
  user,
}: QuestionCardProps) {
  const { setUser } = useAuth();
  const [selectedOption, setSelectedOption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(new Date(serverTime) >= new Date(question.closesAt));

  useEffect(() => {
    const interval = setInterval(() => {
      if (new Date() >= new Date(question.closesAt)) setExpired(true);
    }, 1000);
    return () => clearInterval(interval);
  }, [question.closesAt]);

  const hasPrediction = !!prediction;
  const isClosed = expired || new Date() >= new Date(question.closesAt);
  const { homeTeam, awayTeam, neutralOptions } = splitMatchOptions(question.options);
  const hasMatchLayout = !!(homeTeam && awayTeam);
  const activeSelection = prediction?.selectedOptionId || selectedOption;

  const closeTimeLabel = new Date(question.closesAt).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const submitPrediction = async (optionId: string) => {
    setSubmitting(true);
    setError("");
    try {
      await api.submitPrediction(question.id, optionId);
      setShowAuthPrompt(false);
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to submit prediction");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePredictClick = () => {
    if (!selectedOption || submitting) return;
    if (!user) {
      setLoginError("");
      setShowAuthPrompt(true);
      return;
    }
    void submitPrediction(selectedOption);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await api.login(loginPhone);
      setUser(res.user);
      setShowAuthPrompt(false);
      setLoginLoading(false);
      await submitPrediction(selectedOption);
    } catch (err) {
      setLoginError(err instanceof ApiError ? err.message : "Login failed");
      setLoginLoading(false);
    }
  };

  const lockedOption = question.options.find(
    (option) => option.id === prediction?.selectedOptionId
  );

  const card = (
    <div className="relative w-full max-w-lg rounded-[1.35rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="px-6 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316] text-white">
            <Trophy className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-[#1a2b4b] sm:text-xl">Submit Prediction</h3>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Today&apos;s Question</p>
        <p className="mt-2 text-xl font-bold text-[#1a2b4b] sm:text-2xl">{question.title}</p>

        <div className="mt-6">
          {hasPrediction ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Your prediction (locked)
              </p>
              {lockedOption?.flagIso ? (
                <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_0_28px_rgba(249,115,22,0.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getFlagImageUrl(lockedOption.flagIso)}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
              ) : null}
              <p className="mt-3 text-lg font-bold text-[#1a2b4b]">
                {lockedOption
                  ? lockedOption.flagIso
                    ? getTeamDisplayName(lockedOption)
                    : lockedOption.label
                  : "—"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Submitted {new Date(prediction.createdAt).toLocaleString()}
              </p>
            </div>
          ) : isClosed ? (
            <div className="rounded-2xl bg-red-50 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-red-500">Predictions are closed for this question.</p>
              <p className="mt-2 text-xs text-slate-500">Closed at {closeTimeLabel}</p>
            </div>
          ) : hasMatchLayout ? (
            <>
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <TeamPick
                  option={homeTeam}
                  glow={TEAM_GLOWS[0]}
                  selected={activeSelection === homeTeam.id}
                  disabled={hasPrediction}
                  onSelect={() => setSelectedOption(homeTeam.id)}
                />
                <span className="shrink-0 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  VS
                </span>
                <TeamPick
                  option={awayTeam}
                  glow={TEAM_GLOWS[1]}
                  selected={activeSelection === awayTeam.id}
                  disabled={hasPrediction}
                  onSelect={() => setSelectedOption(awayTeam.id)}
                />
              </div>

              {neutralOptions.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {neutralOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOption(option.id)}
                      className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                        activeSelection === option.id
                          ? "border-[#f97316] bg-[#f97316]/10 text-[#f97316]"
                          : "border-slate-200 bg-white text-[#1a2b4b] hover:border-[#1a2b4b]/30"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                    activeSelection === option.id
                      ? "border-[#f97316] bg-[#f97316]/5 text-[#f97316]"
                      : "border-slate-200 bg-white text-[#1a2b4b] hover:border-[#1a2b4b]/30"
                  }`}
                >
                  {option.flagIso ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getFlagImageUrl(option.flagIso)}
                      alt=""
                      className="h-5 w-5 shrink-0 rounded-full object-cover"
                    />
                  ) : null}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {!hasPrediction && !isClosed && (
            <>
              {error && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-center text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handlePredictClick}
                disabled={!selectedOption || submitting}
                className="mt-6 w-full rounded-xl bg-[#f97316] py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : selectedOption
                    ? "Confirm Prediction"
                    : "Select your team to predict"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-b-[1.35rem] border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7">
        <CountdownTimer
          closesAt={question.closesAt}
          serverTime={serverTime}
          variant="footer"
          onExpire={() => setExpired(true)}
        />
        <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a2b4b]/70">
          <Clock className="h-3.5 w-3.5" />
          <span>{isClosed || hasPrediction ? `Closed ${closeTimeLabel}` : `Closes ${closeTimeLabel}`}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className={
          showPlayer
            ? "grid w-full grid-cols-1 items-end gap-6 lg:min-h-[24rem] lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)_minmax(0,1fr)] xl:min-h-[28rem]"
            : "flex w-full justify-center"
        }
      >
        {showPlayer && (
          <div className="hidden min-w-0 overflow-hidden items-end justify-end lg:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PLAYER_IMAGE}
              alt=""
              aria-hidden="true"
              className="pointer-events-none h-[20rem] w-auto max-w-full object-contain object-bottom xl:h-[24rem]"
            />
          </div>
        )}
        <div className={`min-w-0 w-full max-w-lg ${showPlayer ? "justify-self-center lg:justify-self-auto" : ""}`}>
          {card}
        </div>
        {showPlayer && <div className="hidden min-w-0 lg:block" aria-hidden="true" />}
      </div>

      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2b4b]/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-center text-lg font-bold text-[#1a2b4b]">
              Login to confirm prediction
            </h3>
            <p className="mb-5 text-center text-sm text-slate-500">
              Enter your registered mobile number to submit your pick
              {selectedOption
                ? ` for ${question.options.find((option) => option.id === selectedOption)?.label}`
                : ""}
              .
            </p>

            <form onSubmit={handleLoginSubmit}>
              <label
                htmlFor={`predict-login-phone-${question.id}`}
                className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"
              >
                Registered Mobile
              </label>
              <input
                id={`predict-login-phone-${question.id}`}
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="Verification number"
                className="mb-4 block w-full rounded-xl border border-transparent bg-[#f1f5f9] px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#f97316] focus:outline-none focus:ring-2 focus:ring-[#f97316]/20"
                required
              />

              {loginError && (
                <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {loginError}
                  {loginError.toLowerCase().includes("not registered") && (
                    <>
                      {" "}
                      <Link href="/register" className="font-semibold underline">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl bg-[#f97316] py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ea580c] disabled:opacity-50"
              >
                {loginLoading ? "Logging in..." : "Login & Confirm"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-600">
              New here?{" "}
              <Link href="/register" className="font-semibold text-[#f97316] hover:underline">
                Register
              </Link>
            </p>

            <button
              type="button"
              onClick={() => setShowAuthPrompt(false)}
              className="mt-4 w-full text-sm font-semibold text-slate-500 hover:text-[#1a2b4b]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function PredictionLayout({
  questions,
  serverTime,
  predictions,
  onSubmitted,
  user,
  fetching,
}: {
  questions: Question[];
  serverTime: string;
  predictions: Record<string, { selectedOptionId: string; createdAt: string }>;
  onSubmitted: () => void;
  user: User | null;
  fetching: boolean;
}) {
  const submittedCount = Object.keys(predictions).length;

  if (fetching) {
    return <p className="relative z-10 py-12 text-center text-slate-500">Loading predictions...</p>;
  }

  if (questions.length === 0) {
    return (
      <div className="relative z-10 mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-slate-500">
          {user
            ? "No open predictions right now. Check back soon!"
            : "No open predictions right now. Register to be ready when the next match opens."}
        </p>
        {!user && (
          <>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-xl bg-[#f97316] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#ea580c]"
            >
              Register Now
            </Link>
            <p className="mt-4 text-sm text-slate-600">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-[#f97316] hover:underline">
                Login here
              </Link>
            </p>
          </>
        )}
      </div>
    );
  }

  const content = (
    <>
      {submittedCount > 0 && user && (
        <p className="relative z-10 mb-6 text-center text-sm text-slate-500">
          {questions.length} open question{questions.length !== 1 ? "s" : ""} · {submittedCount} submitted by you
        </p>
      )}

      <div
        className={
          questions.length === 1
            ? "relative z-10 mx-auto w-full max-w-6xl px-2 sm:px-4"
            : "relative z-10 grid grid-cols-1 gap-10 xl:grid-cols-2"
        }
      >
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            serverTime={serverTime}
            prediction={predictions[question.id] ?? null}
            onSubmitted={onSubmitted}
            showPlayer={questions.length === 1 && index === 0}
            user={user}
          />
        ))}
      </div>
    </>
  );

  return content;
}

export function PredictionHub({ user }: PredictionHubProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [predictions, setPredictions] = useState<
    Record<string, { selectedOptionId: string; createdAt: string }>
  >({});
  const [serverTime, setServerTime] = useState(new Date().toISOString());
  const [fetching, setFetching] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setFetching(true);
    try {
      if (user) {
        const res = await api.getOpenQuestions();
        setQuestions(res.questions);
        setPredictions(res.predictions);
        setServerTime(res.serverTime);
      } else {
        const res = await api.getPublicOpenQuestions();
        setQuestions(res.questions);
        setPredictions({});
        setServerTime(res.serverTime);
      }
    } catch {
      setQuestions([]);
      setPredictions({});
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return (
    <section className="prediction-hub-section pb-10 pt-5 sm:pb-12 sm:pt-6" id="predict">
      <div className="prediction-hub-grid" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <p className="relative z-10 mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#f97316]">
          Prediction Hub
        </p>
        <h2 className="relative z-10 mb-8 text-center text-2xl font-extrabold uppercase text-slate-900 sm:mb-10 sm:text-3xl">
          Open Predictions
        </h2>

        <PredictionLayout
          questions={questions}
          serverTime={serverTime}
          predictions={predictions}
          onSubmitted={fetchQuestions}
          user={user}
          fetching={fetching}
        />
      </div>
    </section>
  );
}
