import Link from "next/link";

export const metadata = {
  title: "Page Not Found | RSP AI Editor",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="app-shell flex flex-1 items-center justify-center px-4 py-20">
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
              className="primary-button"
            >
              Back to Home
            </Link>
            <Link
              href="/editor"
              className="secondary-button"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </main>
  );
}
