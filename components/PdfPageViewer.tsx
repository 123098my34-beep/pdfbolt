"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface PageData {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
}

interface PdfPageViewerProps {
  file: File;
  selectedPages?: number[];
  onPageSelect?: (pages: number[]) => void;
  selectable?: boolean;
  className?: string;
}

export default function PdfPageViewer({
  file,
  selectedPages = [],
  onPageSelect,
  selectable = false,
  className = "",
}: PdfPageViewerProps) {
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { renderPageThumbnails } = await import("@/lib/pdf-utils");
      const result = await renderPageThumbnails(file, 0.4);
      if (!cancelled) {
        setPages(result);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [file]);

  const togglePage = (num: number) => {
    if (!onPageSelect) return;
    if (selectedPages.includes(num)) {
      onPageSelect(selectedPages.filter((p) => p !== num));
    } else {
      onPageSelect([...selectedPages, num]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-bolt-accent animate-spin" />
        <span className="ml-3 text-sm font-body text-bolt-muted">
          Rendering pages...
        </span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {pages.map((page) => {
        const isSelected = selectedPages.includes(page.pageNum);
        return (
          <button
            key={page.pageNum}
            onClick={() => selectable && togglePage(page.pageNum)}
            className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
              selectable
                ? "cursor-pointer hover:border-bolt-accent/60"
                : "cursor-default"
            } ${
              isSelected
                ? "border-bolt-accent shadow-lg shadow-bolt-accent/20"
                : "border-bolt-border"
            }`}
          >
            <img
              src={page.dataUrl}
              alt={`Page ${page.pageNum}`}
              className="w-full h-auto"
              draggable={false}
            />
            <div
              className={`absolute inset-0 transition-opacity ${
                isSelected ? "bg-bolt-accent/10" : "bg-transparent"
              }`}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span className="text-xs font-body text-white/80">
                Page {page.pageNum}
              </span>
            </div>
            {selectable && isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-bolt-accent rounded-full flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-bolt-bg"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
