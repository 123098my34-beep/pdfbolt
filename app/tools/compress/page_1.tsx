"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { compressPdf, downloadBlob } from "@/lib/pdf-utils";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);

  const handleCompress = async () => {
    if (!file) return;

    setState("processing");
    setMessage("Compressing your PDF...");

    try {
      const result = await compressPdf(file);
      const before = file.size;
      const after = result.byteLength;
      setStats({ before, after });
      downloadBlob(result, `compressed_${file.name}`);
      setState("done");
      const reduction = ((1 - after / before) * 100).toFixed(0);
      setMessage(`Compressed! ${reduction}% smaller`);
    } catch (err) {
      setState("error");
      setMessage("Compression failed. The file might be already optimized.");
    }
  };

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce file size without losing quality. Runs entirely in your browser."
      icon={<Zap className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to compress"
            sublabel="Max size depends on your device memory"
          />
        ) : (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-8 text-center">
            <p className="font-sans font-semibold mb-1">{file.name}</p>
            <p className="text-sm font-body text-bolt-muted mb-4">
              Original: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={() => {
                setFile(null);
                setState("idle");
                setStats(null);
              }}
              className="text-xs font-body text-bolt-accent hover:underline"
            >
              Choose a different file
            </button>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {stats && state === "done" && (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs font-body text-bolt-muted mb-1">Before</p>
                <p className="font-sans font-semibold">
                  {(stats.before / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <p className="text-xs font-body text-bolt-muted mb-1">After</p>
                <p className="font-sans font-semibold text-bolt-accent">
                  {(stats.after / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <p className="text-xs font-body text-bolt-muted mb-1">Saved</p>
                <p className="font-sans font-semibold text-green-400">
                  {((1 - stats.after / stats.before) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {file && state !== "processing" && (
          <button
            onClick={handleCompress}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Compress PDF
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
