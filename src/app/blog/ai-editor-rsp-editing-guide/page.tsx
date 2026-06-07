import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "How to Use AI Editor | RSP AI Editor",
  description: "Learn how to use the RSP AI Editor workflow to edit images and copy in seconds. Step-by-step guide with examples.",
};

export default function BlogGuidePage() {
  return (
    <>
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <article className="max-w-3xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <div className="text-sm text-on-surface-variant mb-4">Tutorial • 5 min read</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              How to Use AI Editor RSP Editing Workflow
            </h1>
            <p className="text-lg text-on-surface-variant">
              A comprehensive guide to getting the most out of RSP AI Editor. 
              Learn how to edit images and copy in seconds with no signup required.
            </p>
          </header>

          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-on-surface-variant leading-relaxed">
              RSP AI Editor is a powerful, free AI-powered tool that lets you edit images and 
              copy without creating an account. Whether you need to enhance photos, remove 
              backgrounds, or restyle your images, this guide will walk you through the process.
            </p>
          </section>

          {/* Prerequisites */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What You&apos;ll Need</h2>
            <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
              <li>A web browser (Chrome, Firefox, Safari, or Edge)</li>
              <li>An image file (JPG, PNG, or WebP) under 10MB</li>
              <li>No account or signup required</li>
            </ul>
          </section>

          {/* Step-by-Step Guide */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Step-by-Step Guide</h2>
            
            {/* Step 1 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Upload Your Image
              </h3>
              <p className="text-on-surface-variant mb-3">
                Drag and drop your image onto the upload zone, or click to select a file. 
                Supported formats include JPG, PNG, and WebP (up to 10MB).
              </p>
              <div className="bg-surface-container rounded-lg p-4 border border-outline-variant">
                <p className="text-sm text-on-surface-variant">
                  <strong>Tip:</strong> For best results, use high-resolution images. 
                  The AI works best with photos that have clear subjects.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Choose Your Editing Mode
              </h3>
              <p className="text-on-surface-variant mb-3">
                Select one of three AI-powered editing modes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-on-surface-variant">
                <li><strong>Auto Enhance:</strong> Automatically improves lighting, color, and clarity</li>
                <li><strong>Background Remove:</strong> Creates perfect cutouts with one click</li>
                <li><strong>Restyle:</strong> Applies artistic transformations to your image</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Apply and Preview
              </h3>
              <p className="text-on-surface-variant">
                Click &quot;Apply&quot; to start the AI processing. Results are typically ready in
                under 8 seconds. You can compare the before and after versions directly in the editor.
              </p>
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Download Your Result
              </h3>
              <p className="text-on-surface-variant">
                Click the download button to save your edited image. Free users get 
                standard quality exports. Pro users enjoy HD exports without watermarks.
              </p>
            </div>
          </section>

          {/* Common Issues */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Common Issues & Solutions</h2>
            
            <div className="space-y-4">
              <div className="bg-surface-container rounded-lg p-4">
                <h4 className="font-semibold mb-2">Image won&apos;t upload</h4>
                <p className="text-sm text-on-surface-variant">
                  Check that your file is under 10MB and in JPG, PNG, or WebP format.
                </p>
              </div>
              
              <div className="bg-surface-container rounded-lg p-4">
                <h4 className="font-semibold mb-2">Processing takes too long</h4>
                <p className="text-sm text-on-surface-variant">
                  Processing time depends on server load and image size. Try a smaller image 
                  or upgrade to Pro for priority processing.
                </p>
              </div>
              
              <div className="bg-surface-container rounded-lg p-4">
                <h4 className="font-semibold mb-2">Quality not satisfactory</h4>
                <p className="text-sm text-on-surface-variant">
                  Upload higher resolution images for better results. Each AI mode has 
                  different optimal use cases—experiment to find what works best for your content.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary-container text-on-primary-container rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-on-primary-container/80 mb-6">
              Try RSP AI Editor now—it&apos;s free, instant, and requires no signup.
            </p>
            <Link
              href="/editor"
              className="inline-block bg-surface text-primary px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Open the Editor
            </Link>
          </section>
        </article>
      </main>
      
      <Footer />
    </>
  );
}
