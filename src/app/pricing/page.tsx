import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing | RSP AI Editor",
  description: "Simple, transparent pricing. Start free, upgrade when you need more. No hidden fees.",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: 0,
      period: "month",
      description: "Perfect for trying out the editor",
      features: [
        "10 edits per day",
        "Standard export quality",
        "JPG and PNG support",
        "No signup required",
      ],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: 12,
      period: "month",
      description: "For creators who need more power",
      features: [
        "Unlimited edits",
        "HD export (no watermark)",
        "Batch processing up to 10 images",
        "Priority processing speed",
        "All export formats including WebP",
      ],
      cta: "Upgrade to Pro",
      highlighted: true,
    },
  ];

  const faqs = [
    {
      question: "Do I really need no signup?",
      answer: "Yes, for the Free plan you can start editing immediately without creating an account. Your session is stored locally in your browser.",
    },
    {
      question: "What image formats are supported?",
      answer: "We support JPG, PNG, and WebP for imports. Pro users can export in high-fidelity formats including optimized WebP and high-quality PNG.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. Pro subscriptions are billed monthly and you can cancel from your dashboard at any time with no hidden fees or penalties.",
    },
  ];

  return (
    <>
      <Header />

      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative pt-16 pb-8 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-on-background mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-on-surface-variant">
            Start free. Upgrade when you need more.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 pb-16">
          <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-6 flex flex-col ${
                  plan.highlighted
                    ? "border-2 border-primary shadow-lg relative md:scale-105 z-10"
                    : "border border-outline-variant hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-on-surface mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-on-background">${plan.price}</span>
                    <span className="text-on-surface-variant text-sm">/ {plan.period}</span>
                  </div>
                  <p className="text-on-surface-variant">{plan.description}</p>
                </div>

                <ul className="flex-grow space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                      <span className="text-on-surface">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/editor"
                  className={`w-full py-3 rounded-lg font-medium text-center transition-all active:scale-95 ${
                    plan.highlighted
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:opacity-90"
                      : "border-2 border-primary text-primary hover:bg-primary-container"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Custom Plan Link */}
          <div className="mt-12 text-center">
            <p className="text-on-surface-variant">
              Need a custom plan for your team?{" "}
              <a href="#" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                Contact us.
              </a>
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 py-12 border-t border-outline-variant/30">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-surface-container-low rounded-xl group">
                <summary className="p-4 cursor-pointer list-none flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-on-surface">{faq.question}</h4>
                  <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-4 pb-4 text-on-surface-variant">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
