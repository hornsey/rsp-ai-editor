import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Pricing for Creators",
  description: "Free and Pro pricing for RSP AI Editor. Start free, upgrade for higher volume, HD exports, and no watermark.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "for quick trials",
    description: "Good for testing the workflow before committing.",
    cta: "Start Free",
    href: "/editor",
    featured: false,
    features: [
      "5 image edits per day",
      "10 copy rewrites per day",
      "Standard export quality",
      "Session history for 24 hours",
      "Watermark may apply to exports",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "per month",
    description: "$9/mo when billed yearly. Built for regular production work.",
    cta: "Upgrade to Pro",
    href: "/editor",
    featured: true,
    features: [
      "500 image edits per month",
      "1,000 copy rewrites per month",
      "HD exports",
      "No watermark",
      "Priority processing",
      "Batch export up to 20 images",
      "History retention for 90 days",
    ],
  },
];

const faqs = [
  ["Do I need to sign up for Free?", "No. The Free path is designed so you can test the core editor before signup."],
  ["Does Pro include higher limits?", "Yes. Pro includes higher monthly limits so usage stays clear and sustainable."],
  ["Can I use exports commercially?", "Yes, subject to the Terms and any content policy restrictions that apply to your input and output."],
  ["What about teams?", "Team is planned at $39/mo for 3 seats with a shared pool of 2,500 edits/month."],
];

export default function PricingPage() {
  return (
    <main>
      <section className="app-shell section-y text-center">
        <p className="eyebrow mb-3">Pricing</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold md:text-6xl">Simple Pricing for Creators</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
          Start free. Upgrade when you need more volume, HD exports, no watermark, and priority processing.
        </p>
      </section>

      <section className="app-shell pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-[20px] border p-6 ${
                plan.featured ? "border-primary bg-surface shadow-[var(--shadow-md)]" : "border-outline-variant bg-surface"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-6 top-6 rounded-full bg-primary-container px-3 py-1 text-xs font-extrabold text-on-primary-container">
                  Most useful
                </span>
              ) : null}
              <h2 className="text-2xl font-extrabold">{plan.name}</h2>
              <p className="mt-2 text-on-surface-variant">{plan.description}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-extrabold">{plan.price}</span>
                <span className="pb-2 text-sm font-semibold text-on-surface-variant">{plan.cadence}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm leading-6">
                    <span className="material-symbols-outlined mt-0.5 text-lg text-primary">check_circle</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={plan.featured ? "primary-button mt-8" : "secondary-button mt-8"}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-[20px] border border-dashed border-outline bg-surface p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-xl font-extrabold">Team plan</h2>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                $39/mo for 3 seats, shared 2,500 edit pool, simple collaboration, team billing, and priority email support.
              </p>
            </div>
            <span className="rounded-lg bg-surface-muted px-4 py-2 text-sm font-bold text-on-surface-variant">Coming later</span>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="app-shell section-y">
          <h2 className="text-center text-3xl font-extrabold">Frequently Asked Questions</h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="soft-card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {question}
                  <span className="material-symbols-outlined transition group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
