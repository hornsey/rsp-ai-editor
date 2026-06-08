import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Use AI Editor RSP Editing Workflow",
  description: "Step-by-step guide to using RSP AI Editor for fast image and copy editing without signup-first friction.",
};

export default function BlogPostPage() {
  return (
    <main className="app-shell py-10">
      <nav className="mb-8 text-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <span>AI Editor RSP Editing Workflow</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        <p className="eyebrow mb-3">Guide</p>
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
          How to Use AI Editor RSP Editing Workflow
        </h1>
        <p className="mt-5 text-lg leading-8 text-on-surface-variant">
          A practical workflow for getting quick image and copy edits without learning a professional editing suite.
        </p>

        <section className="mt-10 space-y-4">
          {[
            ["1", "Upload your image", "Use a JPG, PNG, or WebP file up to 10MB. The workflow is designed for a no-signup first trial."],
            ["2", "Choose your task", "Pick Auto Enhance, Background Remove, Style Restyle, or open Copy Rewrite for text variants."],
            ["3", "Review and export", "Download standard quality on Free. Upgrade when you need HD exports, no watermark, or higher volume."],
          ].map(([step, title, body]) => (
            <div key={step} className="soft-card p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-extrabold text-on-primary">
                  {step}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold">When Free is enough</h2>
          <p className="mt-3 leading-7 text-on-surface-variant">
            Free is meant for quick trials and occasional edits: 5 image edits per day and 10 copy rewrites per day. It is the right fit when you need to test the output quality or finish a small personal task.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-extrabold">When Pro makes sense</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-on-surface-variant">
            <li>You need 500 image edits/month and 1,000 copy rewrites/month.</li>
            <li>You need HD exports and no watermark for client or commercial work.</li>
            <li>You need priority processing or batch export up to 20 images.</li>
          </ul>
        </section>

        <section className="mt-12 rounded-[20px] bg-on-surface p-8 text-center text-white">
          <h2 className="text-2xl font-extrabold">Ready to try the workflow?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/75">
            Open the editor, upload a supported image, and complete your first task before deciding whether Pro is useful.
          </p>
          <Link href="/editor" className="primary-button mt-6">
            Open the Editor
          </Link>
        </section>
      </article>
    </main>
  );
}
