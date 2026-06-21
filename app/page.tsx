"use client";

import { useState, useRef, useEffect } from "react";
import {
  Zap, Shield, Merge, Scissors, RotateCw, Lock, FileImage,
  FileText, ChevronDown, ArrowRight, Upload, Sparkles, Globe,
  Hash, Settings, Copy, Clock, Eye, download
} from "lucide-react";

const tools = [
  { id: "compress", title: "Compress", description: "Reduce file size by up to 90% without quality loss", icon: Zap, color: "from-amber-500/20 to-orange-500/20", href: "/tools/compress", new: false },
  { id: "merge", title: "Merge", description: "Combine multiple PDFs into a single document", icon: Merge, color: "from-blue-500/20 to-cyan-500/20", href: "/tools/merge", new: false },
  { id: "split", title: "Split", description: "Extract pages or split PDF into multiple files", icon: Scissors, color: "from-purple-500/20 to-pink-500/20", href: "/tools/split", new: false },
  { id: "reorder", title: "Reorder & Edit", description: "Visual drag-and-drop page editor with delete support", icon: Globe, color: "from-sky-500/20 to-blue-500/20", href: "/tools/reorder", new: true },
  { id: "rotate", title: "Rotate", description: "Rotate PDF pages to any orientation", icon: RotateCw, color: "from-green-500/20 to-emerald-500/20", href: "/tools/rotate", new: false },
  { id: "pdf-to-image", title: "PDF to Image", description: "Render pages as PNG or JPG at custom DPI", icon: FileImage, color: "from-indigo-500/20 to-violet-500/20", href: "/tools/pdf-to-image", new: true },
  { id: "image-to-pdf", title: "Image to PDF", description: "Convert images to PDF with page size options", icon: FileText, color: "from-teal-500/20 to-cyan-500/20", href: "/tools/image-to-pdf", new: false },
  { id: "watermark", title: "Watermark", description: "Add tiled or centered text watermarks", icon: Sparkles, color: "from-yellow-500/20 to-amber-500/20", href: "/tools/watermark", new: false },
  { id: "page-numbers", title: "Page Numbers", description: "Customizable numbering with position and format", icon: Hash, color: "from-rose-500/20 to-pink-500/20", href: "/tools/page-numbers", new: true },
  { id: "extract-text", title: "Extract Text", description: "Pull all text from a PDF, copy or download as .txt", icon: Copy, color: "from-emerald-500/20 to-green-500/20", href: "/tools/extract-text", new: true },
  { id: "protect", title: "Protect", description: "Encrypt with password and set permissions", icon: Lock, color: "from-red-500/20 to-rose-500/20", href: "/tools/protect", new: true },
  { id: "metadata", title: "Edit Metadata", description: "View and edit document properties", icon: Settings, color: "from-slate-500/20 to-gray-500/20", href: "/tools/metadata", new: true },
];

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <div ref={ref} className="font-display text-5xl md:text-6xl text-bolt-accent tracking-tight">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

function HeroSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-bolt-accent/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-600/3 rounded-full blur-[80px] animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245,158,11,0.06) 1px, transparent 0)`,
          backgroundSize: "48px 48px",
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className={`inline-flex items-center gap-2 bg-bolt-surface border border-bolt-border rounded-full px-4 py-2 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-body text-bolt-muted">12 tools — zero uploads — 100% free</span>
        </div>

        <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] leading-[0.85] tracking-tight mb-8">
          <span className={`block transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            PDF tools
          </span>
          <span className={`block text-bolt-accent transition-all duration-700 delay-250 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            that run here.
          </span>
        </h1>

        <p className={`text-lg md:text-xl font-body text-bolt-muted max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Compress, merge, split, convert, protect, add watermarks, extract text — entirely in your browser. No file uploads. No limits. No accounts.
        </p>

        <div className={`transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div
            className="drop-zone relative max-w-2xl mx-auto rounded-2xl p-14 cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag-over"); }}
            onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
            onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("drag-over"); window.location.href = "/tools/merge"; }}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden" />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7 text-bolt-accent" />
              </div>
              <div>
                <p className="text-lg font-sans font-semibold mb-1">Drop your PDF here</p>
                <p className="text-sm font-body text-bolt-muted">or click to browse — nothing leaves your device</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-16 transition-all duration-700 delay-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <a href="#tools" className="inline-flex flex-col items-center gap-2 text-bolt-muted hover:text-bolt-accent transition-colors">
            <span className="text-xs font-body">12 tools below</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="border-y border-bolt-border bg-bolt-surface/30">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <AnimatedCounter end={12} suffix="" />
          <p className="text-sm font-body text-bolt-muted mt-2">PDF tools</p>
        </div>
        <div>
          <AnimatedCounter end={0} suffix="" />
          <p className="text-sm font-body text-bolt-muted mt-2">Files uploaded</p>
        </div>
        <div>
          <AnimatedCounter end={0} suffix="" />
          <p className="text-sm font-body text-bolt-muted mt-2">Accounts needed</p>
        </div>
        <div>
          <AnimatedCounter end={100} suffix="%" />
          <p className="text-sm font-body text-bolt-muted mt-2">Browser-based</p>
        </div>
      </div>
    </section>
  );
}

function ToolsGrid() {
  const [filter, setFilter] = useState<"all" | "new">("all");
  const filtered = filter === "new" ? tools.filter((t) => t.new) : tools;

  return (
    <section id="tools" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">Everything you need</p>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">Pick a tool.</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-body transition-all ${filter === "all" ? "bg-bolt-accent/10 text-bolt-accent border border-bolt-accent/30" : "text-bolt-muted border border-bolt-border hover:border-bolt-accent/30"}`}
          >
            All tools
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-lg text-xs font-body transition-all ${filter === "new" ? "bg-bolt-accent/10 text-bolt-accent border border-bolt-accent/30" : "text-bolt-muted border border-bolt-border hover:border-bolt-accent/30"}`}
          >
            New tools
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filtered.map((tool) => {
          const Icon = tool.icon;
          return (
            <a key={tool.id} href={tool.href} className="tool-card block bg-bolt-surface border border-bolt-border rounded-2xl p-8 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              {tool.new && (
                <span className="absolute top-4 right-4 text-[10px] font-body font-bold text-bolt-bg bg-bolt-accent px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-bolt-elevated border border-bolt-border flex items-center justify-center mb-5 group-hover:border-bolt-accent/40 transition-colors">
                  <Icon className="w-5 h-5 text-bolt-muted group-hover:text-bolt-accent transition-colors" />
                </div>
                <h3 className="font-sans text-lg font-semibold mb-2 group-hover:text-bolt-accent transition-colors">{tool.title}</h3>
                <p className="text-sm font-body text-bolt-muted leading-relaxed">{tool.description}</p>
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

function HowItWorks() {
  const steps = [
    { num: "01", title: "Drop your file", description: "Drag a PDF onto any tool page or click to browse. Your file stays on your device.", icon: Upload },
    { num: "02", title: "Configure options", description: "Adjust quality, pages, format, and other settings. Every tool has clear controls.", icon: Settings },
    { num: "03", title: "Download result", description: "Processing happens in your browser via WebAssembly. Hit download when it's done.", icon: Download },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">How it works</p>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">Three steps. That's it.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} className="relative">
              <div className="text-8xl font-display text-bolt-border/40 absolute -top-6 -left-2 select-none">
                {step.num}
              </div>
              <div className="relative z-10 pt-12">
                <div className="w-12 h-12 rounded-xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-bolt-accent" />
                </div>
                <h3 className="font-sans text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm font-body text-bolt-muted leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ComparisonTable() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">The difference</p>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">PDFBolt vs. the rest</h2>
      </div>
      <div className="bg-bolt-surface border border-bolt-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 text-sm font-body border-b border-bolt-border">
          <div className="p-5 font-sans font-semibold text-bolt-muted">Feature</div>
          <div className="p-5 font-sans font-semibold text-bolt-accent text-center">PDFBolt</div>
          <div className="p-5 font-sans font-semibold text-bolt-muted text-center">SmallPDF / Others</div>
        </div>
        {[
          ["File uploads", "Zero — 100% local", "Required — sent to servers"],
          ["Privacy", "Files never leave browser", "Files stored temporarily"],
          ["Account required", "No", "Yes (for full access)"],
          ["Daily limits", "None", "2 free/day"],
          ["File size limits", "Device memory only", "Usually 50-100MB"],
          ["Tools available", "12 and growing", "Varies by plan"],
          ["Speed", "Instant — no round trip", "Depends on upload + server"],
          ["Cost", "Free forever", "$9-15/month"],
        ].map(([feature, bolt, others], i) => (
          <div key={i} className={`grid grid-cols-3 text-sm font-body ${i % 2 === 0 ? "" : "bg-bolt-bg/50"}`}>
            <div className="p-4 text-bolt-muted">{feature}</div>
            <div className="p-4 text-center text-bolt-accent">{bolt}</div>
            <div className="p-4 text-center text-bolt-muted">{others}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "Zero Upload", description: "Your files are processed entirely in your browser using WebAssembly. They never leave your device.", icon: Shield },
    { title: "No Limits", description: "No file size caps. No daily limits. No premium walls. Use every tool, every time, for free.", icon: Zap },
    { title: "Instant Speed", description: "No server round-trips means processing starts instantly. No waiting for uploads or downloads from cloud.", icon: Clock },
    { title: "Open & Transparent", description: "No hidden processing. What you see is what happens. Client-side means verifiable.", icon: Eye },
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">Why PDFBolt</p>
        <h2 className="font-display text-4xl md:text-6xl tracking-tight">Privacy isn't a feature.<br />It's the foundation.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="bg-bolt-surface border border-bolt-border rounded-2xl p-8 text-left">
              <div className="w-12 h-12 rounded-xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-bolt-accent" />
              </div>
              <h3 className="font-sans text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm font-body text-bolt-muted leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "Are my files really safe?", a: "Absolutely. All processing uses WebAssembly and JavaScript running in your browser tab. Your files are loaded into memory, processed, and the result is offered as a download. At no point does data leave your device." },
    { q: "Is there a file size limit?", a: "No hard limits on our end. Since processing happens on your device, the practical limit depends on your available RAM. Most modern devices handle files up to 500MB+ without issues." },
    { q: "Do I need to create an account?", a: "No. PDFBolt works instantly — no sign-up, no email, no tracking, no cookies. Just drop your file and go." },
    { q: "How is this different from SmallPDF or ILovePDF?", a: "They upload your files to their servers for processing. We never do. Everything runs in your browser via WebAssembly, which means faster processing, total privacy, and no artificial limits." },
    { q: "Can I use this on mobile?", a: "Yes! PDFBolt is fully responsive and works on mobile browsers. For best performance with large files, we recommend Chrome on desktop." },
    { q: "Do you keep copies of my files?", a: "No. We never see your files. They exist only in your browser's memory during processing and are garbage-collected when you close the tab." },
  ];

  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-xs font-body text-bolt-accent mb-3 tracking-widest uppercase">Questions</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight">Frequently asked</h2>
      </div>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-bolt-surface border border-bolt-border rounded-xl overflow-hidden">
            <button className="w-full text-left px-8 py-5 flex items-center justify-between gap-4" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <span className="font-sans font-medium text-sm">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-bolt-muted flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? "max-h-48" : "max-h-0"}`}>
              <p className="px-8 pb-5 text-sm font-body text-bolt-muted leading-relaxed">{faq.a}</p>
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
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4">Stop uploading your PDFs.</h2>
          <p className="font-body text-bolt-muted text-lg mb-8">12 tools. Zero uploads. Right here in your browser.</p>
          <a href="#tools" className="inline-flex items-center gap-2 bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105">
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
      <StatsBar />
      <ToolsGrid />
      <HowItWorks />
      <ComparisonTable />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
