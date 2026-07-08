"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LaunchpadHeader } from "@/components/launchpad/LaunchpadHeader";
import { LaunchpadFooter } from "@/components/launchpad/LaunchpadFooter";
import { HeroSection } from "@/components/launchpad/HeroSection";
import { StepsSection } from "@/components/launchpad/StepsSection";
import { MentorshipSection } from "@/components/launchpad/MentorshipSection";
import { WinnerSelectionSection } from "@/components/launchpad/WinnerSelectionSection";
import { PredictionHub } from "@/components/launchpad/PredictionHub";

export function HomeContent() {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
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
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <LaunchpadHeader />

      <HeroSection />
      <StepsSection />
      <MentorshipSection />
      <PredictionHub user={loading ? null : user} />
      <WinnerSelectionSection />
      <LaunchpadFooter />
    </div>
  );
}
