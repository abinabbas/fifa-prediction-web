"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";
import { HeroSection } from "@/components/launchpad/HeroSection";
import { StepsSection } from "@/components/launchpad/StepsSection";
import { MentorshipSection } from "@/components/launchpad/MentorshipSection";
import { WinnerSelectionSection } from "@/components/launchpad/WinnerSelectionSection";
import { ExperienceSection } from "@/components/launchpad/ExperienceSection";
import { PredictionHub } from "@/components/launchpad/PredictionHub";
import { LeaderboardSection } from "@/components/launchpad/LeaderboardSection";

export function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    const section = searchParams.get("section");
    if (!section) return;

    const targets: Record<string, string> = {
      "how-it-works": "how-it-works",
      prizes: "prizes",
      predict: "predict",
    };

    const id = targets[section];
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [searchParams, user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip overflow-y-visible bg-[#fafafa]">
      <LaunchpadHeader />

      <HeroSection />
      <StepsSection />
      <PredictionHub user={user} />
      <MentorshipSection />
      <LeaderboardSection user={user} />
      <WinnerSelectionSection />
      <ExperienceSection />
      <LaunchpadFooter />
    </div>
  );
}
