import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rsp-ai-editor.com"),
  title: {
    default: "RSP AI Editor | Edit Images & Copy in Seconds",
    template: "%s | RSP AI Editor",
  },
  description: "Upload your photo, pick an AI mode, and download in seconds. Free, instant, no account needed. AI-powered image editing for everyone.",
  keywords: ["AI editor", "image editing", "background removal", "photo enhancer", "AI tools", "free image editor"],
  authors: [{ name: "RSP AI Editor" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rsp-ai-editor.com",
    siteName: "RSP AI Editor",
    title: "RSP AI Editor | Edit Images & Copy in Seconds",
    description: "Upload your photo, pick an AI mode, and download in seconds. Free, instant, no account needed.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSP AI Editor | Edit Images & Copy in Seconds",
    description: "Upload your photo, pick an AI mode, and download in seconds. Free, instant, no account needed.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-on-surface antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
