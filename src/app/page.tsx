"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let pos = ((clientX - rect.left) / rect.width) * 100;
    pos = Math.max(0, Math.min(100, pos));
    setSliderPosition(pos);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };
    const handleEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const taskCards = [
    {
      icon: "colors_spark",
      title: "Enhance Photo",
      description: "Upscale resolution and fix lighting instantly with Lumina Engine.",
      badge: "AI Suggested",
      href: "/editor?mode=enhance",
    },
    {
      icon: "magic_button",
      title: "Remove Background",
      description: "Perfect cutouts in milliseconds. No manual masking required.",
      badge: "One-Click",
      href: "/editor?mode=remove-bg",
    },
    {
      icon: "palette",
      title: "Restyle Image",
      description: "Transform your photos into cinematic, anime, or 3D art styles.",
      badge: "Pro Mode",
      href: "/editor?mode=restyle",
    },
  ];

  const features = [
    {
      icon: "auto_fix_high",
      title: "Intelligent Denoise",
      description: "Automatically removes ISO noise while preserving skin texture and fine details.",
    },
    {
      icon: "hdr_strong",
      title: "Smart HDR",
      description: "Balances shadows and highlights for a wide dynamic range without artifacts.",
    },
    {
      icon: "color_lens",
      title: "Neural Grading",
      description: "Uses professional color science to grade your images based on aesthetic trends.",
    },
  ];

  const useCases = [
    {
      icon: "person",
      title: "Content Creators",
      description: "Batch-produce social media visuals with consistent quality in under 3 minutes.",
      cta: "Try Free",
    },
    {
      icon: "storefront",
      title: "Small Business Owners",
      description: "Create polished product images without a design team or expensive software.",
      cta: "Try Free",
    },
    {
      icon: "school",
      title: "Students & Freelancers",
      description: "Polish resume photos, project graphics, and personal content on a budget.",
      cta: "Try Free",
    },
  ];

  const faqs = [
    {
      q: "Do I need to sign up?",
      a: "No. Start editing immediately — no account, no email, no credit card required.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, PNG, and WebP input. Pro users also get high-fidelity export options.",
    },
    {
      q: "How many free edits do I get?",
      a: "10 free edits per day on the Free plan, with no account needed.",
    },
    {
      q: "What's the speed like?",
      a: "Most edits complete in under 8 seconds. Priority speed is available on Pro.",
    },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div className="h-16" />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto text-center py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-on-surface">
            Edit Images &amp; Copy in Seconds — <br className="hidden md:block" />
            No Signup Required
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-8">
            Upload your photo, pick an AI mode, and download in seconds. Free, instant, no account needed.
          </p>

          <div className="flex flex-col items-center gap-4">
            <a
              href="/editor"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl text-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
            >
              Start Editing Free
              <span className="material-symbols-outlined">arrow_downward</span>
            </a>

            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                group
              </span>
              <span className="text-sm">Trusted by 50,000+ creators</span>
            </div>
          </div>
        </section>

        {/* ── Proof Strip ── */}
        <section className="bg-surface-container py-5 border-y border-outline-variant">
          <div className="px-4 md:px-10 max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-2xl">speed</span>
              <p className="text-sm font-semibold text-on-surface">Under 8 seconds</p>
              <p className="text-xs text-on-surface-variant">P95 edit processing time</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-2xl">person_off</span>
              <p className="text-sm font-semibold text-on-surface">No signup needed</p>
              <p className="text-xs text-on-surface-variant">Start editing in seconds</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-primary text-2xl">download</span>
              <p className="text-sm font-semibold text-on-surface">Free to download</p>
              <p className="text-xs text-on-surface-variant">Standard quality, no watermark</p>
            </div>
          </div>
        </section>

        {/* ── Task Shortcuts ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 mt-12">
          {taskCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="bg-surface-container border border-outline-variant p-6 rounded-xl flex flex-col items-start gap-3 hover:border-primary transition-colors group cursor-pointer"
            >
              <div className="bg-primary-container/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {card.icon}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-1">{card.title}</h3>
                <p className="text-sm text-on-surface-variant">{card.description}</p>
              </div>

              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-auto group-hover:bg-primary group-hover:text-on-primary transition-colors">
                {card.badge}
              </span>
            </a>
          ))}
        </section>

        {/* ── Before/After Showcase ── */}
        <section className="bg-surface-container-low py-16 mb-16 overflow-hidden">
          <div className="px-4 md:px-10 max-w-[1440px] mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Unmatched AI Precision</h2>
              <p className="text-base text-on-surface-variant">
                See how RSP AI transforms a raw mobile photo into professional quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Before/After Slider */}
              <div
                className="rounded-xl shadow-lg aspect-[4/3] relative overflow-hidden cursor-ew-resize"
                ref={sliderRef}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                {/* After Image */}
                <div className="absolute inset-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbnDIYNJlPN7DDiiJu6ns-1b6AAO3FoaQBkk4HvZkCAMbjw4PDYTJcNq_ZEmnJMFW8ue6Ur-iFCMJ35uExWrVOrsl9MbeYZbKy2rw0dKPdFdLBgveYqUUHg2hlwGsPHMukeMuotDErgWAHXYb1Ku8ggw25LrHqzTtLL4lLntjouMgtJD8HB_bypYW50ya-EFpZMwbVrF77hlXgIC34eHdDD_r9m3Om-FvsBpnisf0fTIpyGFyEAlta66zuy0nGDQBhMbokyKFyl4Ia"
                    alt="A high-quality, professional editorial photograph"
                  />
                </div>

                {/* Before Image (Clipped) */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    className="w-full h-full object-cover grayscale brightness-75"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO9kSbO4Ki_SDVIgG_6jZEHU4Sv4ND07x9DG-2v9XGO2EL7fzVPrhtbp05Msx52SC2AhQa3pYQUW3JQtHJ8YAHItwH0VPVhHGpxZ8wvHqcxyRGZaz7-LdFSmTIwhO-77haJWHwc8VhDfEopa_Lhr3G_azz74xQXvLeVTrEXBeUBC4gNskYLXHDsiY8jNNpmbmWII_WpXMMCjOonyHMnX7FyTBPyTlJSoFz3A13-oKY4VTGGos2uSc5-dWmuvPu0hb6_UC60HPon4mK"
                    alt="A blurry, low-resolution photo"
                  />
                </div>

                {/* Slider Handle */}
                <div className="slider-handle" style={{ left: `${sliderPosition}%` }} />

                <div className="absolute bottom-4 left-4 bg-black/40 text-white px-4 py-1 rounded-full text-sm backdrop-blur-md">
                  Original
                </div>
                <div className="absolute bottom-4 right-4 bg-primary/80 text-white px-4 py-1 rounded-full text-sm backdrop-blur-md">
                  Enhanced
                </div>
              </div>

              {/* Feature List */}
              <div className="flex flex-col gap-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary">{feature.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-on-surface-variant">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Three Steps to Perfection</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-outline-variant -z-0" />

            {[
              { step: 1, title: "Upload", desc: "Drag and drop any JPEG, PNG, or WebP file. No size limits.", icon: "cloud_upload" },
              { step: 2, title: "AI Edit", desc: "Select a mode and watch RSP process your image in real-time.", icon: "auto_awesome" },
              { step: 3, title: "Download", desc: "Save your high-res result instantly. No watermarks, ever.", icon: "download" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-bold shadow-lg">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-base text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Use Cases ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Built for Creators Like You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((uc) => (
              <div key={uc.title} className="p-6 bg-surface-container rounded-xl border border-outline-variant hover:border-primary/50 transition-all">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary">{uc.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-on-surface">{uc.title}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{uc.description}</p>
                <Link href="/editor" className="text-sm font-medium text-primary hover:underline">
                  {uc.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing Teaser ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mb-16">
          <div className="bg-surface-container rounded-2xl p-8 md:p-12 border border-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Free plan */}
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant">
                <h3 className="text-lg font-bold text-on-surface mb-1">Free</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-on-surface">$0</span>
                  <span className="text-sm text-on-surface-variant">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {["10 edits per day", "Standard export quality", "JPG, PNG, WebP", "No signup required"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-base">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/editor" className="block text-center py-2.5 px-4 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-all">
                  Get Started Free
                </Link>
              </div>

              {/* Pro plan */}
              <div className="bg-primary text-on-primary rounded-xl p-6 relative">
                <div className="absolute top-0 right-4 -translate-y-1/2 bg-on-primary text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Most Popular
                </div>
                <h3 className="text-lg font-bold mb-1">Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold">$12</span>
                  <span className="text-sm opacity-80">/month</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {["Unlimited edits", "HD export, no watermark", "Batch up to 10 images", "Priority processing", "All export formats"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm opacity-90">
                      <span className="material-symbols-outlined text-on-primary text-base">check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing" className="block text-center py-2.5 px-4 rounded-lg bg-on-primary text-primary font-semibold hover:opacity-90 transition-all">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Preview ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Frequently Asked</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-sm font-semibold text-on-surface">{faq.q}</span>
                  <span className={`material-symbols-outlined text-on-surface-variant text-xl transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-on-surface-variant border-t border-outline-variant/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/pricing" className="text-sm text-primary font-medium hover:underline">
              View all FAQs →
            </Link>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mb-16">
          <div className="bg-primary-container text-on-primary-container p-8 md:p-12 rounded-3xl text-center flex flex-col items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to make your images weightless?</h2>
            <p className="text-lg text-on-primary-container/80 max-w-xl">
              Experience the future of AI editing today. Join the community of 50,000+ creators who trust RSP.
            </p>
            <a
              href="/editor"
              className="bg-surface text-primary px-8 py-4 rounded-xl text-xl font-semibold hover:scale-105 transition-all shadow-xl"
            >
              Get Started Now
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
