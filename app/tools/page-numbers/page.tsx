"use client";

import { useState } from "react";
import { Hash, Download } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { addPageNumbers, downloadBlob } from "@/lib/pdf-utils";

const positions = [
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-center", label: "Top Center" },
] as const;

const formats = [
  { value: "{n}", label: "1, 2, 3..." },
  { value: "Page {n}", label: "Page 1, Page 2..." },
  { value: "{n} of {total}", label: "1 of 10, 2 of 10..." },
  { value: "- {n} -", label: "- 1 -, - 2 -..." },
];

export default function PageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<string>("bottom-center");
  const [format, setFormat] = useState("{n}");
  const [startFrom, setStartFrom] = useState(1);
  const [fontSize, setFontSize] = useState(10);
  const [margin, setMargin] = useState(40);
  const [skipFirst, setSkipFirst] = useState(false);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    if (!file) return;
    setState("processing");
    setMessage("Adding page numbers...");

    try {
      const result = await addPageNumbers(file, {
        position: position as any,
        startFrom,
        fontSize,
        format,
        margin,
        skipFirst,
      });
      downloadBlob(result, `numbered_${file.name}`);
      setState("done");
      setMessage("Page numbers added!");
    } catch (err) {
      setState("error");
      setMessage("Failed to add page numbers.");
    }
  };

  return (
    <ToolPageLayout
      title="Page Numbers"
      description="Add customizable page numbers to every page of your PDF."
      icon={<Hash className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to number"
          />
        ) : (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold">{file.name}</p>
                <p className="text-sm font-body text-bolt-muted">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setState("idle"); }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-2">Position</label>
              <div className="grid grid-cols-2 gap-3">
                {positions.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPosition(p.value)}
                    className={`py-3 rounded-xl border text-sm font-body transition-all ${
                      position === p.value
                        ? "bg-bolt-accent/10 border-bolt-accent text-bolt-accent"
                        : "bg-bolt-elevated border-bolt-border text-bolt-muted hover:border-bolt-accent/40"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-2">Format</label>
              <div className="grid grid-cols-2 gap-3">
                {formats.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`py-3 rounded-xl border text-sm font-body transition-all text-left px-4 ${
                      format === f.value
                        ? "bg-bolt-accent/10 border-bolt-accent text-bolt-accent"
                        : "bg-bolt-elevated border-bolt-border text-bolt-muted hover:border-bolt-accent/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-body text-bolt-muted block mb-2">
                  Start from page
                </label>
                <input
                  type="number"
                  min="1"
                  value={startFrom}
                  onChange={(e) => setStartFrom(Number(e.target.value))}
                  className="w-full bg-bolt-bg border border-bolt-border rounded-xl px-4 py-3 font-body text-sm text-bolt-text focus:outline-none focus:border-bolt-accent/40"
                />
              </div>
              <div>
                <label className="text-sm font-body text-bolt-muted block mb-2">
                  Font size: {fontSize}pt
                </label>
                <input
                  type="range"
                  min="6"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-bolt-accent mt-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-body text-bolt-muted block mb-2">
                  Margin: {margin}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-bolt-accent mt-3"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skipFirst}
                    onChange={(e) => setSkipFirst(e.target.checked)}
                    className="w-4 h-4 accent-bolt-accent"
                  />
                  <span className="text-sm font-body text-bolt-muted">
                    Skip first page
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && state !== "processing" && (
          <button
            onClick={handleAdd}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Hash className="w-5 h-5" />
            Add Page Numbers
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
