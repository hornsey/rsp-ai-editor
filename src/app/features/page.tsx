import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features for Fast AI Editing",
  description: "Auto Enhance, Background Remove, Style Restyle, and copy rewrite workflows for fast image and copy editing.",
};

const features = [
  {
    icon: "colors_spark",
    title: "Auto Enhance",
    description: "Improve clarity, lighting, and color for everyday photos without tuning dozens of sliders.",
    fit: "Best for creator thumbnails, profile images, blog graphics, and quick polish before publishing.",
  },
  {
    icon: "auto_fix_high",
    title: "Background Remove",
    description: "Create cleaner cutouts for product, profile, and campaign visuals with one task-oriented mode.",
    fit: "Best for ecommerce listings, simple ads, marketplace posts, and presentation assets.",
  },
  {
    icon: "palette",
    title: "Style Restyle",
    description: "Explore art-direction variants when you need a more expressive image for social or campaign use.",
    fit: "Best for concept images, campaign experiments, and fast mood changes.",
  },
  {
    icon: "edit_note",
    title: "Copy Rewrite",
    description: "Turn one caption, product line, or short description into three tone variants: clean, persuasive, concise.",
    fit: "Best for titles, captions, listing descriptions, and call-to-action copy.",
  },
];

export default function FeaturesPage() {
  return (
    <main>
      <section className="app-shell section-y">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Features</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Features for Fast AI Editing</h1>
          <p className="mt-5 text-lg leading-8 text-on-surface-variant">
            RSP AI Editor focuses on high-frequency image and copy tasks, not a complex professional canvas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/editor" className="primary-button">Try Feature Now</Link>
            <Link href="/pricing" className="secondary-button">Compare Plans</Link>
          </div>
        </div>
      </section>

      <section className="app-shell pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="panel-card p-6">
              <span className="material-symbols-outlined rounded-xl bg-primary-container p-3 text-3xl text-primary">
                {feature.icon}
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">{feature.title}</h2>
              <p className="mt-3 leading-7 text-on-surface-variant">{feature.description}</p>
              <div className="mt-5 rounded-xl bg-surface-muted p-4">
                <p className="text-sm font-bold text-on-surface">Good fit</p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">{feature.fit}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="app-shell section-y grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow mb-3">Why it feels faster</p>
            <h2 className="text-3xl font-extrabold md:text-4xl">Task shortcuts replace blank-canvas setup</h2>
            <p className="mt-4 leading-7 text-on-surface-variant">
              The product contract is upload, choose mode, see result, export. That keeps first-use friction low for creators, sellers, and personal users.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              ["No signup-first wall", "Users can test quality before deciding whether Pro is useful."],
              ["Explainable errors", "Format, size, network, server, and quota states should tell users what to do next."],
              ["Clear limits", "Free and Pro plan boundaries are shown directly instead of hidden behind vague claims."],
            ].map(([title, body]) => (
              <div key={title} className="soft-card p-5">
                <h3 className="font-extrabold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell py-16">
        <div className="rounded-[20px] bg-on-surface p-8 text-white md:p-12">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold">Open the editor and try a task.</h2>
              <p className="mt-2 text-white/75">No account required for the first workflow.</p>
            </div>
            <Link href="/editor" className="primary-button">Open Editor</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
