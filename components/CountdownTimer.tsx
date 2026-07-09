"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  closesAt: string;
  serverTime: string;
  onExpire?: () => void;
  compact?: boolean;
  variant?: "default" | "footer";
}

export function CountdownTimer({
  closesAt,
  serverTime,
  onExpire,
  compact,
  variant = "default",
}: CountdownTimerProps) {
  const offset = new Date(serverTime).getTime() - Date.now();
  const closesAtMs = new Date(closesAt).getTime();

  const getRemaining = () => Math.max(0, closesAtMs - (Date.now() + offset));
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getRemaining();
      setRemaining(next);
      if (next <= 0) {
        onExpire?.();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [closesAt, serverTime, onExpire]);

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const expired = remaining <= 0;

  if (variant === "footer") {
    return (
      <div className={`text-center ${expired ? "text-red-500" : "text-[#1a2b4b]"}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          {expired ? "Predictions closed" : "Time remaining"}
        </p>
        <p className="mt-1 text-xl font-extrabold tabular-nums sm:text-2xl">
          {expired
            ? "00:00:00"
            : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <p className="text-xs text-muted flex items-center justify-center gap-1.5 mt-4">
        <span>🕐</span>
        {expired ? "PREDICTIONS CLOSED" : "CLOSES 30M BEFORE KICKOFF"}
      </p>
    );
  }

  return (
    <div className={`text-center ${expired ? "text-red-500" : "text-muted"}`}>
      <p className="text-xs font-bold tracking-widest uppercase mb-1">
        {expired ? "Predictions Closed" : "Time Remaining"}
      </p>
      <p className="text-2xl font-black tabular-nums text-navy">
        {expired
          ? "00:00:00"
          : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
      </p>
    </div>
  );
}
