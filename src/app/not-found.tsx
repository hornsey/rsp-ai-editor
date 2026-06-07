import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found | RSP AI Editor",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-6">
            <span className="material-symbols-outlined text-primary text-8xl">search_off</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-lg text-on-surface-variant mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
            <Link
              href="/editor"
              className="bg-surface-container text-on-surface px-6 py-3 rounded-xl font-medium hover:bg-surface-container-high transition-colors"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
