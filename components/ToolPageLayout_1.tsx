"use client";

import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  icon,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-body text-bolt-muted hover:text-bolt-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tools
        </a>

        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl tracking-tight mb-3">
              {title}
            </h1>
            <p className="font-body text-bolt-muted text-lg">{description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-24">{children}</div>
    </div>
  );
}
