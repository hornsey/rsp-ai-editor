"use client";

import { useState } from "react";
import Link from "next/link";

type PricingTab = "monthly" | "annual" | "credit-packs";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyCredits: 5,
    cadence: "quick trials",
    description: "Try the core editor before signup or billing.",
    cta: "Start Free",
    href: "/editor",
    badge: "No signup first",
    tone: "neutral",
    features: [
      "5 image edits per day",
      "10 copy rewrites per day",
      "Standard export quality",
      "Local session history only",
      "Watermark may apply to exports",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 108,
    monthlyCredits: 1200,
    cadence: "regular production",
    description: "Best value for creators who edit every week.",
    cta: "Choose Pro",
    href: "/editor",
    badge: "Most useful",
    tone: "pro",
    features: [
      "1,200 credits every month",
      "HD exports",
      "No watermark",
      "Priority processing",
      "Batch export up to 20 images",
      "Use credit packs for overflow",
    ],
  },
  {
    name: "Max",
    monthlyPrice: 28,
    annualPrice: 252,
    monthlyCredits: 3500,
    cadence: "high-volume workflows",
    description: "For heavier runs, launches, and repeat editing sessions.",
    cta: "Upgrade to Max",
    href: "/editor",
    badge: "Highest volume",
    tone: "max",
    features: [
      "3,500 credits every month",
      "HD exports",
      "No watermark",
      "Priority processing",
      "Batch export up to 20 images",
      "Best for power users and bursty work",
    ],
  },
];

const creditPacks = [
  {
    id: "starter",
    name: "Starter Pack",
    price: "$6.9",
    credits: "500 credits",
    note: "First purchase only",
    validity: "Valid for 6 months",
    cta: "Order Starter Pack",
    highlight: true,
  },
  {
    id: "standard",
    name: "Standard Pack",
    price: "$26.9",
    credits: "1,500 credits",
    note: "For occasional overflow",
    validity: "Valid for 6 months",
    cta: "Order Standard Pack",
    highlight: false,
  },
  {
    id: "growth",
    name: "Growth Pack",
    price: "$48.9",
    credits: "3,000 credits",
    note: "For bursty usage",
    validity: "Valid for 6 months",
    cta: "Order Growth Pack",
    highlight: false,
  },
  {
    id: "scale",
    name: "Scale Pack",
    price: "$86.9",
    credits: "6,000 credits",
    note: "For the largest top-ups",
    validity: "Valid for 6 months",
    cta: "Order Scale Pack",
    highlight: false,
  },
];

const faqs = [
  ["Do I need to sign up for Free?", "No. The Free path is designed so you can test the core editor before signup."],
  ["What is a credit?", "One image edit currently consumes one credit. Monthly credits reset each billing cycle; purchased credits are overflow top-ups."],
  ["What is the difference between Pro and Max?", "Pro is the best default for regular creators. Max is highlighted for heavier workflows that need 3,500 monthly credits."],
  ["Do unused monthly credits roll over?", "No. Monthly credits reset each billing cycle. Purchased credit packs are valid for 6 months."],
  ["Do you offer one-time credit packs?", "Yes. Credit packs are available for overflow usage. The 500-credit Starter Pack is limited to the first purchase only."],
  ["Can I use exports commercially?", "Yes, subject to the Terms and any content policy restrictions that apply to your input and output."],
];

function formatPrice(plan: (typeof plans)[number], pricingTab: PricingTab): string {
  if (plan.monthlyPrice === 0) return "$0";
  return pricingTab === "annual" ? `$${Math.round(plan.annualPrice / 12)}` : `$${plan.monthlyPrice}`;
}

function formatCadence(plan: (typeof plans)[number]): string {
  if (plan.monthlyPrice === 0) return plan.cadence;
  return "per month";
}

function annualBillingLabel(plan: (typeof plans)[number]): string | null {
  if (plan.monthlyPrice === 0) return null;
  return `Billed Annually · $${plan.annualPrice}/year`;
}

export default function PricingClient() {
  const [pricingTab, setPricingTab] = useState<PricingTab>("annual");

  return (
    <main>
      <section className="app-shell section-y text-center">
        <p className="eyebrow mb-3">Pricing</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold md:text-6xl">Simple Pricing for Creators</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
          Start free. Upgrade to Pro or Max when you need more monthly credits, HD exports, no watermark, and priority processing.
        </p>

        <div className="mx-auto mt-8 inline-flex flex-wrap justify-center gap-1 rounded-full border border-outline bg-surface p-1 shadow-[var(--shadow-sm)]">
          {([
            ["monthly", "Monthly"],
            ["annual", "Annual"],
            ["credit-packs", "Credit Packs"],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPricingTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-extrabold transition ${
                pricingTab === tab ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
              aria-pressed={pricingTab === tab}
            >
              {label}
              {tab === "annual" ? <span className="ml-2 rounded-full bg-primary-container px-2 py-0.5 text-xs text-on-primary-container">Save 25%</span> : null}
            </button>
          ))}
        </div>
      </section>

      <section className="app-shell pb-16">
        {pricingTab === "credit-packs" ? (
          <div className="rounded-[24px] border border-outline bg-surface p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Credit Packs</p>
                <h2 className="mt-2 text-3xl font-extrabold">Order extra credits when you need more volume</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
                  One-time credit packs are valid for 6 months and work as overflow after your monthly credits.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-extrabold text-on-primary-container">
                <span className="material-symbols-outlined text-lg">local_offer</span>
                Starter Pack is first-purchase-only
              </span>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {creditPacks.map((pack) => (
                <article
                  key={pack.name}
                  className={`relative flex flex-col rounded-2xl border p-5 ${
                    pack.highlight ? "border-primary bg-primary-container/50 ring-2 ring-primary/15" : "border-outline-variant bg-surface-muted"
                  }`}
                >
                  {pack.highlight ? (
                    <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-on-primary">
                      First purchase deal
                    </span>
                  ) : null}
                  <h3 className="pr-28 text-lg font-extrabold">{pack.name}</h3>
                  <p className="mt-5 text-4xl font-extrabold">{pack.price}</p>
                  <p className="mt-2 text-xl font-extrabold text-on-surface">{pack.credits}</p>
                  <p className="mt-3 text-sm leading-6 text-on-surface-variant">{pack.note}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{pack.validity}</p>
                  <Link href={`/editor?credit_pack=${pack.id}`} className={pack.highlight ? "primary-button mt-6" : "secondary-button mt-6"}>
                    {pack.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isPro = plan.tone === "pro";
              const isMax = plan.tone === "max";
              return (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-[24px] border p-6 transition ${
                    isPro
                      ? "border-primary bg-surface shadow-[var(--shadow-md)] ring-2 ring-primary/15"
                      : isMax
                        ? "border-on-surface bg-on-surface text-white shadow-[var(--shadow-md)]"
                        : "border-outline-variant bg-surface"
                  }`}
                >
                  <span
                    className={`absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-extrabold ${
                      isMax ? "bg-white text-on-surface" : "bg-primary-container text-on-primary-container"
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <h2 className="text-2xl font-extrabold">{plan.name}</h2>
                  <p className={`mt-2 pr-24 ${isMax ? "text-white/70" : "text-on-surface-variant"}`}>{plan.description}</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-5xl font-extrabold">{formatPrice(plan, pricingTab)}</span>
                    <span className={`pb-2 text-sm font-semibold ${isMax ? "text-white/65" : "text-on-surface-variant"}`}>
                      {formatCadence(plan)}
                    </span>
                  </div>
                  {pricingTab === "annual" && annualBillingLabel(plan) ? (
                    <p className={`mt-2 text-sm font-bold ${isMax ? "text-white" : "text-primary"}`}>{annualBillingLabel(plan)}</p>
                  ) : (
                    <p className={`mt-2 text-sm ${isMax ? "text-white/65" : "text-on-surface-variant"}`}>{plan.cadence}</p>
                  )}
                  <div className={`mt-6 rounded-2xl p-4 ${isMax ? "bg-white/10" : "bg-surface-muted"}`}>
                    <p className="text-sm font-extrabold">Monthly credit allocation</p>
                    <p className="mt-1 text-2xl font-extrabold">{plan.monthlyCredits.toLocaleString()} credits</p>
                  </div>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm leading-6">
                        <span className={`material-symbols-outlined mt-0.5 text-lg ${isMax ? "text-white" : "text-primary"}`}>check_circle</span>
                        <span className={isMax ? "text-white/85" : undefined}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href} className={isPro || isMax ? "primary-button mt-8" : "secondary-button mt-8"}>
                    {plan.cta}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
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
