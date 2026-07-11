import { PageContainer } from "@/components/launchpad/PageContainer";
import { WorldCupFixturesWidget } from "@/components/launchpad/WorldCupFixturesWidget";

const terms = [
  "Only one prediction per participant is allowed for each match.",
  "If multiple or duplicate predictions are submitted for the same match, only the first submission will be considered valid.",
  "Any subsequent entries for the same match will be automatically disregarded.",
  "Datameris Launchpad reserves the right to verify all submissions and make the final decision regarding winner selection.",
  "Any attempt to manipulate or misuse the challenge may result in disqualification.",
];

export function WinnerSelectionSection() {
  return (
    <section className="bg-white pt-8 pb-10 sm:pt-12 sm:pb-14">
      <PageContainer>
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
            Winner Selection
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
            After the FIFA World Cup Final, all eligible participants will undergo a screening and
            verification process. Based on the screening criteria, 10 qualified participants will be
            selected as winners.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-10">
            Each selected winner will receive our AI-Integrated Digital Marketing Course worth ₹1.5
            Lakh, absolutely FREE.
          </p>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Terms &amp; Disclaimer
          </h3>
          <ul className="list-disc pl-5 space-y-2.5 text-sm sm:text-base text-slate-600 leading-relaxed mb-10">
            {terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Ready to Predict?</h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3">
            Every goal you predict could bring you one step closer to a successful digital marketing
            career.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Predict. Compete. Win. Kickstart Your Career with Datameris Launchpad.
          </p>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-10 sm:mt-14 sm:pt-12">
          <WorldCupFixturesWidget />
        </div>
      </PageContainer>
    </section>
  );
}
