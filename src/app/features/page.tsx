import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Features | RSP AI Editor",
  description: "Discover powerful AI editing features: Auto Enhance, Background Remove, and Style Restyle. Edit images in seconds with professional results.",
};

export default function FeaturesPage() {
  const features = [
    {
      id: "auto-enhance",
      title: "Auto Enhance",
      description: "Instantly improve lighting, color, and clarity with one tap. Our AI analyzes histograms and exposure levels in real-time to deliver professional results.",
      icon: "magic_button",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQraY22HXIEaDLgvprEpKOLKimDFjZpjD_2H4zMv6fs3d1Jwa8gt_nXdxCR1b-C2lpzXSQ0HwYMKWXF_iB1fhl7ueMAsavoBUFUpeeG4oxfXhG7lvZ_HhgEZrjqy1flwTCKzBAXnArB3QC69nEcaH9hhUzk2qc84mWgv07ECydYi1XK6NJwFRT5cUPK2tvHgeSqGB-YGknSfy6Thn1uMiVn1a3ln77uiAdR2AxMLi1uimUSZEHGLKNamHUezOR7kQD0dIlnSGNqHvD",
      imageAlt: "Before and after auto enhancement",
      colSpan: "md:col-span-7",
      imagePosition: "right",
    },
    {
      id: "background-remove",
      title: "Background Remove",
      description: "Create perfect cutouts in seconds using high-precision AI segmentation that handles complex edges like hair and transparency flawlessly.",
      icon: "layers",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxyQfl77STjD2ebOl-gJdq9PInDOenHewfZt8yI2WowFDV5AKDcQgjDLDA3sH8OrMx-8-5BqyquR4PTpmhKflGkVG4nMeXjY478VHMGpmCMVWq6C_88CJ8L9HWCqzydOgBYBkDHYWiK7100dCf3D7ONl7oajh3GcjgawMrlqY4_C1gyAn6Zj4_uIl6TcMyTA9Efsc-qQ5XH0DaiEte-iHdm9YRkUEp96IfDCgBOM3tfSci4xsJUzjV5Odc7Qhohhjm6Pr8yO_kRDa1",
      imageAlt: "Background removal example",
      colSpan: "md:col-span-5",
      imagePosition: "left",
    },
    {
      id: "style-transfer",
      title: "Style Transfer",
      description: "Reimagine your photos in unique artistic styles from cyberpunk to oil painting. Our generative AI adapts to the geometry of your image while applying global aesthetic transformations.",
      icon: "palette",
      tags: ["Cyberpunk", "Oil Painting", "Minimalist"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM1qWTAsUWMvzJsjggOYVxaG656kxyV41ogTU4_NV6HZ7IFngLoFix3X5phxCLXLLtulMx0XAFsIkQhX-CZRygyBrQ3qDRMwBltFZH1X4bz0sy5l3InkC02xEbomlXyHeiV58EhotEDi2c3xN58PxJCumH180wOdAm37fr2XnU75EXpv2lXGB0LVm5uHMvPiT3aRXjxQix2TyN6wbUZamEQbFf70qxXmLIqxsUjJCSD_UEYUW9uQFYZHm9hP3SnRUXSr-ClFjyK10w",
      imageAlt: "Style transfer example",
      colSpan: "md:col-span-12",
      imagePosition: "right",
    },
  ];

  return (
    <>
      <Header />
      
      <main className="flex-1 pt-20 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Powerful AI Editing, <br />
            <span className="text-primary">Zero Learning Curve</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
            Professional grade image manipulation powered by advanced neural networks, 
            designed to be as simple as a single click.
          </p>
        </section>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group bg-white rounded-xl overflow-hidden flex flex-col justify-between border border-outline-variant hover:border-primary transition-all ${feature.colSpan}`}
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-base text-on-surface-variant mb-4">
                  {feature.description}
                </p>
                {feature.tags && (
                  <div className="flex gap-3">
                    {feature.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-surface-container rounded-full text-sm font-medium text-on-surface-variant border border-outline-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={`relative h-64 overflow-hidden ${feature.imagePosition === "left" ? "md:order-first" : ""}`}>
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={feature.image}
                  alt={feature.imageAlt}
                />
                {feature.id === "background-remove" && (
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "10px 10px" }}
                  />
                )}
                {feature.id !== "style-transfer" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
                )}
                {feature.id === "style-transfer" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white md:block hidden" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <section className="mt-24 text-center py-20 bg-primary-container rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl" />
          
          <div className="relative z-10 px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-on-primary-container mb-6">
              Ready to create masterpiece images?
            </h2>
            <p className="text-base text-on-primary-container/80 mb-10 max-w-xl mx-auto">
              Join over 50,000+ creators using RSP AI Editor to enhance their visual storytelling every single day.
            </p>
            <Link
              href="/editor"
              className="inline-block bg-white text-primary px-10 py-5 rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Open Free Editor
            </Link>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-2 bg-surface border-t border-outline-variant shadow-sm rounded-t-xl">
        <Link href="/" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">home</span>
          <span className="text-xs font-medium">Home</span>
        </Link>
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1">
          <span className="material-symbols-outlined">auto_awesome</span>
          <span className="text-xs font-medium">Features</span>
        </div>
        <Link href="/editor" className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">edit</span>
          <span className="text-xs font-medium">Editor</span>
        </Link>
      </nav>

      <Footer />
    </>
  );
}
