"use client";

import { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { PageContainer } from "@/components/launchpad/PageContainer";

const YOUTUBE_VIDEO_ID = "flDmEQ2WBWE";
const WEBSITE_URL = "https://datamerislaunchpad.com/";

export function ExperienceSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-white pb-8 pt-10 sm:pb-10 sm:pt-12">
      <PageContainer>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-medium text-slate-600 sm:text-lg">Experience</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[#1a2b4b] sm:text-3xl">
            Datameris Launchpad
          </h2>

          <div className="relative mt-8 overflow-hidden rounded-2xl bg-[#1e1b4b] shadow-[0_20px_50px_rgba(15,23,42,0.18)] sm:mt-10 sm:rounded-3xl">
            <div className="relative aspect-video w-full">
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Experience Datameris Launchpad"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                    alt="Datameris Launchpad video preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#1e1b4b]/25" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-transform hover:scale-105 sm:h-20 sm:w-20"
                    aria-label="Play video"
                  >
                    <Play className="ml-1 h-7 w-7 fill-white sm:h-8 sm:w-8" />
                  </button>
                </>
              )}
            </div>
          </div>

          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f97316] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)] transition-colors hover:bg-[#ea580c] sm:mt-10"
          >
            Visit Our Website
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </PageContainer>
    </section>
  );
}
