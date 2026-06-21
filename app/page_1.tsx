"use client";

import { useState, useRef } from "react";
import {
  Zap, Shield, Merge, Scissors, RotateCw,
  Lock, FileImage, FileText, ChevronDown,
  ArrowRight, Upload, Sparkles, Globe
} from "lucide-react";

const tools = [
  {
    id: "compress",
    title: "Compress",
    description: "Reduce PDF file size by up to 90% without quality loss",
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/20",
    href: "/tools/compress",
  },
  {
    id: "merge",
    title: "Merge",
    description: "Combine multiple PDFs into a single document",
    icon: Merge,
    color: "from-blue-500/20 to-cyan-500/20",
    href: "/tools/merge",
  },
  {
    id: "split",
    title: "Split",
    description: "Extract pages or split PDF into multiple files",
    icon: Scissors,
    color: "from-purple-500/20 to-pink-500/20",
    href: "/tools/split",
  },
  {
    id: "rotate",
    title: "Rotate",
    description: "Rotate PDF pages to any orientation",
    icon: RotateCw,
    color: "from-green-500/20 to-emerald-500/20",
    href: "/tools/rotate",
  },
  {
    id: "protect",
    title: "Protect",
    description: "Encrypt PDFs with password protection",
    icon: Lock,
    color: "from-red-500/20 to-rose-500/20",
    href: "/tools/protect",
  },
  {
    id: "pdf-to-image",
    title: "PDF to Image",
    description: "Convert PDF pages to PNG or JPG images",
    icon: FileImage,
    color: "from-indigo-500/20 to-violet-500/20",
    href: "/tools/pdf-to-image",
  },
  {
    id: "image-to-pdf",
    title: "Image to PDF",
    description: "Convert JPG, PNG, WEBP images into PDF",
    icon: FileText,
    color: "from-teal-500/20 to-cyan-500/20",
    href: "/tools/image-to-pdf",
  },
  {
    id: "watermark",
    title: "Watermark",
    description: "Add text or image watermarks to your PDFs",
    icon: Sparkles,
    color: "from-yellow-500/20 to-amber-500/20",
    href: "/tools/watermark",
  },
  {
    id: "reorder",
    title: "Reorder Pages",
    description: "Drag and drop to rearrange PDF page order",
    icon: Globe,
    color: "from-sky-500/20 to-blue-500/20",
    href: "/tools/reorder",
  },
];

const faqs = [
  {
    q: "Are my files safe?",
    a: "Your files never leave your browser. All processing happens locally on your device using WebAssembly and JavaScript. We have zero access to your documents.",
  },
  {
    q: "Is there a file size limit?",
    a: "No hard limits. Since processing is client-side, it depends on your device's memory. Most devices handle files up to 500MB+ without issues.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. PDFBolt works instantly — no sign-up, no email, no tracking. Just drop your file and go.",
  },
  {
    q: "Which browsers are supported?",
    a: "PDFBolt works on all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend Chrome for the best performance with large files.",
  },
  {
    q: "How is this different from SmallPDF or ILovePDF?",
    a: "They upload your files to their servers for processing. We never do. Everything runs in your browser, which means faster processing, total privacy, and no artificial limits.",
  },
];

function HeroSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bolt-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-bolt-accent/3 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245,158,11,0.08) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-bolt-surface border border-bolt-border rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-bolt-accent rounded-full animate-pulse" />
          <span className="text-xs font-body text-bolt-muted">
            Zero uploads — 100% browser-based processing
          </span>
        </div>

        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-6">
          <span className="block animate-fade-up">PDF tools</span>
          <span
            className="block text-bolt-accent animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            that run here.
          </span>
        </h1>

        <p
          className="text-lg md:text-xl font-body text-bolt-muted max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          Compress, merge, split, convert, protect — entirely in your browser.
          No file uploads. No size limits. No accounts. Just fast, private PDF
          tools.
        </p>

        <div
          className="animate-fade-up"
          style={{ animationDelay: "0.45s" }}
        >
          <div
            className="drop-zone relative max-w-2xl mx-auto rounded-2xl p-12 cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("drag-over");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("drag-over");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("drag-over");
              const files = Array.from(e.dataTransfer.files);
              if (files.length > 0) {
                window.location.href = "/tools/merge";
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-bolt-accent" />
              </div>
              <div>
                <p className="text-lg font-sans font-semibold mb-1">
                  Drop your PDF here
                </p>
                <p className="text-sm font-body text-bolt-muted">
                  or click to browse — nothing leaves your device
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-16 animate-fade-up"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#tools"
            className="inline-flex flex-col items-center gap-2 text-bolt-muted hover:text-bolt-accent transition-colors"
          >
            <span className="text-xs font-body">Explore tools</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ToolsGrid() {
  return (
    <section id="tools" className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-16">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">
          Everything you need
        </p>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">
          Pick a tool. Get to work.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a
              key={tool.id}
              href={tool.href}
              className="tool-card block bg-bolt-surface border border-bolt-border rounded-2xl p-8 group relative overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-bolt-elevated border border-bolt-border flex items-center justify-center mb-5 group-hover:border-bolt-accent/40 transition-colors">
                  <Icon className="w-5 h-5 text-bolt-muted group-hover:text-bolt-accent transition-colors" />
                </div>
                <h3 className="font-sans text-lg font-semibold mb-2 group-hover:text-bolt-accent transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm font-body text-bolt-muted leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-body text-bolt-muted group-hover:text-bolt-accent transition-colors">
                  <span>Get started</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Zero Upload",
      description:
        "Your files are processed entirely in your browser using WebAssembly. They never leave your device. Period.",
      icon: Shield,
    },
    {
      title: "No Limits",
      description:
        "No file size caps. No daily limits. No 'upgrade to premium' walls. Use every tool, every time, for free.",
      icon: Zap,
    },
    {
      title: "Blazing Fast",
      description:
        "No server round-trips means processing starts instantly. A 50MB PDF compresses in seconds, not minutes.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">
          Why PDFBolt
        </p>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">
          Privacy isn't a feature.<br />It's the foundation.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="bg-bolt-surface border border-bolt-border rounded-2xl p-10 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center mx-auto mb-6">
                <Icon className="w-6 h-6 text-bolt-accent" />
              </div>
              <h3 className="font-sans text-xl font-semibold mb-3">
                {f.title}
              </h3>
              <p className="text-sm font-body text-bolt-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">
          Questions
        </p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">
          Frequently asked
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-bolt-surface border border-bolt-border rounded-xl overflow-hidden"
          >
            <button
              className="w-full text-left px-8 py-5 flex items-center justify-between gap-4"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-sans font-medium text-sm">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-bolt-muted flex-shrink-0 transition-transform duration-300 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? "max-h-48" : "max-h-0"
              }`}
            >
              <p className="px-8 pb-5 text-sm font-body text-bolt-muted leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="bg-bolt-surface border border-bolt-border rounded-3xl p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bolt-accent/5 to-transparent" />
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4">
            Stop uploading your PDFs.
          </h2>
          <p className="font-body text-bolt-muted text-lg mb-8">
            Every tool. Every feature. Right here in your browser.
          </p>
          <a
            href="#tools"
            className="inline-flex items-center gap-2 bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            Start now — it's free
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsGrid />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
