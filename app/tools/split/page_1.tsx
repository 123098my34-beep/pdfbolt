"use client";

import { useState, useEffect } from "react";
import { Scissors } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { splitPdf, getPdfPageCount, downloadBlob } from "@/lib/pdf-utils";

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState("");
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (file) {
      getPdfPageCount(file).then(setPageCount);
    }
  }, [file]);

  const parseRanges = (input: string): [number, number][] => {
    return input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const parts = s.split("-").map(Number);
        if (parts.length === 1) return [parts[0], parts[0]] as [number, number];
        return [parts[0], parts[1]] as [number, number];
      });
  };

  const handleSplit = async () => {
    if (!file || !rangeInput) return;

    setState("processing");
    setMessage("Splitting your PDF...");

    try {
      const ranges = parseRanges(rangeInput);
      const results = await splitPdf(file, ranges);
      results.forEach((r) => downloadBlob(r.bytes, r.name));
      setState("done");
      setMessage(`Split into ${results.length} file${results.length > 1 ? "s" : ""}!`);
    } catch (err) {
      setState("error");
      setMessage("Split failed. Check your page ranges.");
    }
  };

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract specific pages or split into multiple documents."
      icon={<Scissors className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to split"
            sublabel="We'll show you all pages"
          />
        ) : (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-sans font-semibold">{file.name}</p>
                <p className="text-sm font-body text-bolt-muted">
                  {pageCount} pages · {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPageCount(0);
                  setRangeInput("");
                  setState("idle");
                }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-2">
                Page ranges (e.g. 1-3, 5, 7-10)
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder={`1-${pageCount}`}
                className="w-full bg-bolt-bg border border-bolt-border rounded-xl px-4 py-3 font-body text-sm text-bolt-text placeholder:text-bolt-muted/50 focus:outline-none focus:border-bolt-accent/40 transition-colors"
              />
            </div>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && rangeInput && state !== "processing" && (
          <button
            onClick={handleSplit}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Scissors className="w-5 h-5" />
            Split PDF
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
