"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  api,
  ApiError,
  type FootballFixture,
  type FootballLineupSide,
} from "@/lib/api";
import { getFlagImageUrl, getTeamFlagByName } from "@/lib/teamFlags";

function formatMatchDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function statusLabel(fixture: FootballFixture) {
  if (fixture.status === "finished") return "Full time";
  if (fixture.status === "inprogress") {
    return fixture.minute != null ? `Live · ${fixture.minute}'` : "Live";
  }
  if (fixture.status === "notstarted") return "Upcoming";
  return fixture.status;
}

function scoreText(fixture: FootballFixture) {
  if (fixture.status === "notstarted") return "vs";
  if (fixture.home.score == null || fixture.away.score == null) return "vs";
  return `${fixture.home.score} – ${fixture.away.score}`;
}

function TeamBadge({ name }: { name: string }) {
  const flag = getTeamFlagByName(name);
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {flag ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getFlagImageUrl(flag.iso)}
          alt=""
          className="h-10 w-10 rounded-full object-cover shadow-[0_0_0_3px_rgba(255,255,255,1),0_8px_20px_rgba(15,23,42,0.12)] sm:h-12 sm:w-12"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#1a2b4b] sm:h-12 sm:w-12">
          {name.slice(0, 3).toUpperCase()}
        </div>
      )}
      <span className="text-xs font-bold leading-snug text-[#1a2b4b] sm:text-sm">{name}</span>
    </div>
  );
}

function FixtureCard({
  fixture,
  autoRefreshLineups,
}: {
  fixture: FootballFixture;
  autoRefreshLineups?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lineupStatus, setLineupStatus] = useState<string | null>(null);
  const [lineups, setLineups] = useState<FootballLineupSide[] | null>(null);

  async function loadLineups(silent = false) {
    if (!silent) {
      setLoading(true);
      setError("");
    }
    try {
      const data = await api.getFootballLineups(fixture.id);
      setLineupStatus(data.lineupStatus);
      setLineups(data.lineups);
    } catch (err) {
      if (!silent) {
        setError(err instanceof ApiError ? err.message : "Could not load lineups");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function toggleLineups() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (!lineups) await loadLineups();
  }

  useEffect(() => {
    if (!open || !autoRefreshLineups) return;
    const timer = window.setInterval(() => {
      void loadLineups(true);
    }, 60_000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoRefreshLineups, fixture.id]);

  const live = fixture.status === "inprogress";

  return (
    <div className="rounded-[1.25rem] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          <span>{fixture.round}</span>
          <span className={live ? "text-[#f97316]" : ""}>{statusLabel(fixture)}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <TeamBadge name={fixture.home.name} />
          <div className="min-w-[4.5rem] text-center">
            <div
              className={`text-lg font-extrabold tabular-nums sm:text-xl ${
                live ? "text-[#f97316]" : "text-[#1a2b4b]"
              }`}
            >
              {scoreText(fixture)}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{formatMatchDate(fixture.date)}</div>
          </div>
          <TeamBadge name={fixture.away.name} />
        </div>

        {(fixture.venue?.name || fixture.venue?.city) && (
          <p className="mt-3 text-center text-[11px] text-slate-400">
            {[fixture.venue?.name, fixture.venue?.city].filter(Boolean).join(" · ")}
          </p>
        )}

        <button
          type="button"
          onClick={toggleLineups}
          className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#f97316] transition-colors hover:text-[#ea580c]"
        >
          Lineups
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 px-4 py-4 sm:px-5">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading lineups…
            </div>
          )}
          {error && <p className="py-2 text-center text-sm text-red-600">{error}</p>}
          {!loading && !error && lineupStatus === "unavailable" && (
            <p className="py-2 text-center text-sm text-slate-500">
              Lineups not available yet for this match.
            </p>
          )}
          {!loading && !error && lineups && lineups.length > 0 && (
            <>
              {lineupStatus === "predicted" && (
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Predicted lineup · official ~1h before kick-off
                </p>
              )}
              {lineupStatus === "confirmed" && (
                <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f97316]">
                  Official lineup
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                {lineups.map((side) => (
                  <div key={side.teamId}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#1a2b4b]">{side.teamName}</span>
                      {side.formation && (
                        <span className="text-xs text-slate-400">{side.formation}</span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {side.players.map((player) => (
                        <li
                          key={player.id}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <span className="w-5 tabular-nums font-semibold text-[#1a2b4b]">
                            {player.number ?? "–"}
                          </span>
                          <span className="flex-1">{player.name}</span>
                          <span className="text-[10px] uppercase tracking-wide text-slate-400">
                            {player.position}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function FixtureSection({
  title,
  fixtures,
  empty,
}: {
  title: string;
  fixtures: FootballFixture[];
  empty: string;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h4 className="mb-4 text-center text-xs font-extrabold uppercase tracking-[0.16em] text-[#1a2b4b]">
        {title}
      </h4>
      {fixtures.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate-500">{empty}</p>
      ) : (
        <div className="mx-auto grid max-w-3xl gap-4">
          {fixtures.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              autoRefreshLineups={fixture.status !== "finished"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WorldCupFixturesWidget() {
  const [fixtures, setFixtures] = useState<FootballFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.getFootballFixtures();
        if (cancelled) return;
        setFixtures(data.fixtures);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load fixtures");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Live scores: refresh every 30s
    const timer = window.setInterval(load, 30_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const { upcoming, qfResults } = useMemo(() => {
    const upcomingMatches = fixtures
      .filter((f) => f.status === "notstarted" || f.status === "inprogress")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const results = fixtures
      .filter(
        (f) =>
          f.status === "finished" &&
          f.round.toLowerCase().includes("quarter")
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcoming: upcomingMatches, qfResults: results };
  }, [fixtures]);

  return (
    <div>
      <h3 className="mb-2 text-center text-2xl font-extrabold text-[#1a2b4b] sm:text-3xl">
        World Cup Fixtures
      </h3>
      <p className="mb-6 text-center text-sm text-slate-500">
        Quarter-final results, upcoming knockout matches, live scores &amp; lineups.
      </p>

      {loading && fixtures.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading fixtures…
        </div>
      )}

      {error && fixtures.length === 0 && !loading && (
        <p className="rounded-xl bg-red-50 px-4 py-6 text-center text-sm text-red-600">{error}</p>
      )}

      {fixtures.length > 0 && (
        <>
          <FixtureSection
            title="Upcoming & Live"
            fixtures={upcoming}
            empty="No upcoming matches right now."
          />
          <FixtureSection
            title="Quarter-final results"
            fixtures={qfResults}
            empty="No quarter-final results yet."
          />
        </>
      )}
    </div>
  );
}
