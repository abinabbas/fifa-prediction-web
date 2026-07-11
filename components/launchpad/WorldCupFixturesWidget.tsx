"use client";

import Script from "next/script";

const JOTFORM_WIDGET_ID = "019f501a711070008ec0653a575e2c836b3c";
/** Bump when Jotform STYLE/colors change so the embed script reloads. */
const JOTFORM_CACHE_BUST = "20260711b";

export function WorldCupFixturesWidget() {
  return (
    <div>
      <h3 className="mb-2 text-center text-sm font-extrabold uppercase tracking-[0.18em] text-[#1a2b4b]">
        World Cup Fixtures
      </h3>
      <p className="mb-5 text-center text-sm text-slate-500">
        Live FIFA World Cup 2026 fixtures, lineups, and match details.
      </p>

      <div className="w-full overflow-hidden" key={`${JOTFORM_WIDGET_ID}-${JOTFORM_CACHE_BUST}`}>
        <div id={`JFWebsiteWidget-${JOTFORM_WIDGET_ID}`} />
        <Script
          src={`https://www.jotform.com/website-widgets/embed/${JOTFORM_WIDGET_ID}?v=${JOTFORM_CACHE_BUST}`}
          strategy="lazyOnload"
        />
      </div>
    </div>
  );
}
