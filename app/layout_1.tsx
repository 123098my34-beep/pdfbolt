import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDFBolt — Lightning-Fast PDF Tools. Zero Upload.",
  description:
    "Process PDFs entirely in your browser. Compress, merge, split, convert, protect. No file uploads. No limits. No BS.",
  keywords: "PDF tools, compress PDF, merge PDF, split PDF, PDF converter, online PDF editor",
  openGraph: {
    title: "PDFBolt — PDF Tools That Run In Your Browser",
    description: "Compress, merge, split, convert, protect. 100% client-side. Zero uploads.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bolt-bg text-bolt-text antialiased">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-bolt-bg/80 backdrop-blur-xl border-b border-bolt-border">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-bolt-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-bolt-bg"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-display text-xl tracking-tight">
                PDF<span className="text-bolt-accent">Bolt</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="/#tools"
                className="text-sm font-body text-bolt-muted hover:text-bolt-text transition-colors"
              >
                Tools
              </a>
              <a
                href="/#features"
                className="text-sm font-body text-bolt-muted hover:text-bolt-text transition-colors"
              >
                Why PDFBolt
              </a>
              <a
                href="/#faq"
                className="text-sm font-body text-bolt-muted hover:text-bolt-text transition-colors"
              >
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-body text-bolt-accent bg-bolt-accent/10 px-3 py-1.5 rounded-full border border-bolt-accent/20">
                100% Client-Side
              </span>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t border-bolt-border bg-bolt-surface/50 mt-32">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-bolt-accent rounded-lg flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-bolt-bg"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <span className="font-display text-xl">
                    PDF<span className="text-bolt-accent">Bolt</span>
                  </span>
                </div>
                <p className="text-bolt-muted text-sm font-body max-w-md leading-relaxed">
                  Every PDF operation runs entirely in your browser. Your files
                  never touch our servers. No accounts, no limits, no tracking.
                </p>
              </div>
              <div>
                <h4 className="font-sans font-semibold text-sm mb-4 text-bolt-text">
                  Tools
                </h4>
                <div className="flex flex-col gap-2">
                  {["Compress", "Merge", "Split", "Rotate", "Protect", "Convert"].map((t) => (
                    <a
                      key={t}
                      href={`/tools/${t.toLowerCase()}`}
                      className="text-sm font-body text-bolt-muted hover:text-bolt-accent transition-colors"
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-sans font-semibold text-sm mb-4 text-bolt-text">
                  Legal
                </h4>
                <div className="flex flex-col gap-2">
                  {["Privacy Policy", "Terms of Use", "Contact"].map((t) => (
                    <a
                      key={t}
                      href="#"
                      className="text-sm font-body text-bolt-muted hover:text-bolt-accent transition-colors"
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-bolt-border flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs font-body text-bolt-muted">
                © 2026 PDFBolt. All rights reserved.
              </p>
              <p className="text-xs font-body text-bolt-muted">
                Built with care. No files leave your browser. Ever.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
