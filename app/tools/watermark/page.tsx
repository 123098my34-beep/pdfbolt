"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { addWatermark, downloadBlob } from "@/lib/pdf-utils";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.15);
  const [fontSize, setFontSize] = useState(50);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleWatermark = async () => {
    if (!file || !text) return;
    setState("processing");
    setMessage("Adding watermark...");

    try {
      const result = await addWatermark(file, text, { opacity, fontSize });
      downloadBlob(result, `watermarked_${file.name}`);
      setState("done");
      setMessage("Watermark added!");
    } catch (err) {
      setState("error");
      setMessage("Failed to add watermark.");
    }
  };

  return (
    <ToolPageLayout
      title="Add Watermark"
      description="Stamp text watermarks across every page of your PDF."
      icon={<Sparkles className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to watermark"
          />
        ) : (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-6">
            <p className="font-sans font-semibold mb-1">{file.name}</p>
            <p className="text-sm font-body text-bolt-muted mb-4">
              {(file.size / 1024 / 1024).toFixed(1)} MB
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-body text-bolt-muted block mb-2">
                  Watermark text
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-bolt-bg border border-bolt-border rounded-xl px-4 py-3 font-body text-sm text-bolt-text focus:outline-none focus:border-bolt-accent/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-body text-bolt-muted block mb-2">
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-bolt-accent"
                  />
                </div>
                <div>
                  <label className="text-sm font-body text-bolt-muted block mb-2">
                    Size: {fontSize}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-bolt-accent"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setFile(null);
                  setState("idle");
                }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && text && state !== "processing" && (
          <button
            onClick={handleWatermark}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Add Watermark
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
