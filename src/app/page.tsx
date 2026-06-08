import Link from "next/link";

const taskCards = [
  {
    icon: "colors_spark",
    title: "Auto Enhance",
    description: "Improve clarity, lighting, and color without learning manual controls.",
    href: "/editor?mode=enhance",
  },
  {
    icon: "auto_fix_high",
    title: "Background Remove",
    description: "Create cleaner product, profile, and campaign images from one upload.",
    href: "/editor?mode=remove-bg",
  },
  {
    icon: "edit_note",
    title: "Smart Rewrite",
    description: "Generate clean, persuasive, or concise copy variants beside your visual edit.",
    href: "/editor",
  },
];

const proofItems = [
  ["speed", "Fast turnaround", "Built for everyday edits and quick iteration."],
  ["person_off", "No signup first", "Try the core workflow before creating an account."],
  ["download", "Export-ready", "Download standard results, then upgrade for HD needs."],
];

const useCases = [
  ["Creator", "Polish thumbnails, profile images, and post captions without a complex editor."],
  ["Seller", "Prepare product visuals and listing copy when there is no design team on call."],
  ["Student", "Clean up project images and simple copy while staying inside a free-first flow."],
];

const faqs = [
  ["Do I need an account to start?", "No. You can try core editing before signup."],
  ["How many free edits are included?", "The Free plan is designed for quick trials: 5 image edits per day and 10 copy rewrites per day."],
  ["Is output always perfect?", "AI quality can vary. The editor keeps the workflow simple so you can retry or switch modes quickly."],
];

export default function HomePage() {
  return (
    <main>
      <section className="app-shell grid min-h-[calc(100dvh-64px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="eyebrow mb-4">AI editor rsp editing</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-on-surface md:text-6xl">
            Edit Images &amp; Copy in Seconds - No Signup Required
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
            RSP AI Editor helps you enhance photos, remove backgrounds, and rewrite captions in one fast workflow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/editor" className="primary-button">
              Start Editing Free
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
            <a href="#how-it-works" className="secondary-button">
              See How It Works
            </a>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {proofItems.map(([icon, title, body]) => (
              <div key={title} className="soft-card p-4">
                <span className="material-symbols-outlined mb-3 text-primary">{icon}</span>
                <p className="font-bold text-on-surface">{title}</p>
                <p className="mt-1 text-sm leading-5 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card overflow-hidden p-4">
          <div className="rounded-xl border border-outline-variant bg-surface-muted p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-on-surface">Live editor preview</p>
                <p className="text-xs text-on-surface-variant">Upload to mode to result</p>
              </div>
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
                Free trial
              </span>
            </div>
            <div className="grid gap-3">
              <div className="rounded-xl border-2 border-dashed border-outline bg-surface p-8 text-center">
                <span className="material-symbols-outlined text-5xl text-primary">cloud_upload</span>
                <p className="mt-3 font-bold">Drop JPG, PNG, or WebP</p>
                <p className="text-sm text-on-surface-variant">Up to 10MB</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Enhance", "Remove BG", "Restyle"].map((mode, index) => (
                  <div
                    key={mode}
                    className={`rounded-lg border p-3 text-center text-xs font-bold ${
                      index === 0 ? "border-primary bg-primary-container text-on-primary-container" : "border-outline-variant bg-surface"
                    }`}
                  >
                    {mode}
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-surface p-4">
                <div className="mb-3 h-3 w-1/2 rounded-full bg-outline-variant" />
                <div className="h-24 rounded-lg bg-[linear-gradient(135deg,#e8f8f1,#ffffff_45%,#d7f3e7)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-outline-variant bg-surface">
        <div className="app-shell grid gap-4 py-8 md:grid-cols-3">
          {taskCards.map((card) => (
            <Link key={card.title} href={card.href} className="soft-card group p-5 transition hover:-translate-y-1 hover:border-primary">
              <span className="material-symbols-outlined rounded-lg bg-primary-container p-2 text-primary">
                {card.icon}
              </span>
              <h2 className="mt-4 text-xl font-extrabold">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{card.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                Open task
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="app-shell section-y">
        <div className="max-w-2xl">
          <p className="eyebrow mb-3">Workflow</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">One workflow for 80% of daily editing tasks</h2>
          <p className="mt-4 leading-7 text-on-surface-variant">
            The interface is task-based instead of canvas-based, so first-time users can finish an edit without learning complex terminology.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["1", "Upload", "Drag in a supported image up to 10MB."],
            ["2", "Pick a mode", "Choose enhance, background remove, restyle, or copy rewrite."],
            ["3", "Export", "Download standard quality or upgrade when HD/no watermark matters."],
          ].map(([step, title, body]) => (
            <div key={step} className="soft-card p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-on-primary">
                {step}
              </div>
              <h3 className="text-xl font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted">
        <div className="app-shell section-y grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow mb-3">Use cases</p>
            <h2 className="text-3xl font-extrabold md:text-4xl">Built for quick production work</h2>
          </div>
          <div className="grid gap-4">
            {useCases.map(([title, body]) => (
              <div key={title} className="soft-card p-5">
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell section-y grid gap-8 lg:grid-cols-2">
        <div className="panel-card p-6">
          <p className="eyebrow mb-3">Pricing preview</p>
          <h2 className="text-3xl font-extrabold">Free for trials. Pro for higher volume.</h2>
          <p className="mt-4 leading-7 text-on-surface-variant">
            Free includes 5 image edits/day and 10 copy rewrites/day. Pro unlocks 500 image edits/month, HD exports, no watermark, priority processing, and batch export.
          </p>
          <Link href="/pricing" className="primary-button mt-6">
            View Pricing
          </Link>
        </div>
        <div className="grid gap-3">
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
      </section>

      <section className="app-shell pb-16">
        <div className="rounded-[20px] bg-on-surface p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-extrabold">Ready to ship better visuals faster?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/75">
            Start with free edits now. Upgrade only when your workflow grows.
          </p>
          <Link href="/editor" className="mt-6 inline-flex rounded-lg bg-primary px-6 py-3 font-bold text-on-primary hover:bg-[var(--accent-hover)]">
            Start Editing Free
          </Link>
        </div>
      </section>
    </main>
  );
}
