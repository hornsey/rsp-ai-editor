"use client";

import { useState, useEffect, useRef } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

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
      if (isDragging) handleMove((e as TouchEvent).touches[0].clientX);
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

  return (
    <>
      {/* Navigation placeholder - will be added via layout */}
      <div className="h-16" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto text-center py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-on-surface">
            Edit Images & Copy in Seconds — <br className="hidden md:block" />
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

        {/* Task Shortcuts - Bento Grid Style */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
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

        {/* Before/After Showcase */}
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
              <div className="rounded-xl shadow-lg aspect-[4/3] relative overflow-hidden cursor-ew-resize"
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
                <div
                  className="slider-handle"
                  style={{ left: `${sliderPosition}%` }}
                />
                
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
                      <span className="material-symbols-outlined text-primary">
                        {feature.icon}
                      </span>
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

        {/* How It Works */}
        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Three Steps to Perfection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-outline-variant -z-0" />
            
            {[
              { step: 1, title: "Upload", desc: "Drag and drop any JPEG, PNG, or WebP file. No size limits." },
              { step: 2, title: "AI Edit", desc: "Select a mode and watch RSP process your image in real-time." },
              { step: 3, title: "Download", desc: "Save your high-res result instantly. No watermarks, ever." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-base text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final Call to Action */}
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
