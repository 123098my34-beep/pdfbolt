"use client";

import { useState } from "react";
import { FileImage, Download } from "lucide-react";
import JSZip from "jszip";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { pdfToImages, downloadImageBlob, downloadZip } from "@/lib/pdf-utils";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.92);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [resultCount, setResultCount] = useState(0);

  const handleConvert = async () => {
    if (!file) return;
    setState("processing");
    setMessage("Rendering PDF pages...");
    setProgress(0);

    try {
      const results = await pdfToImages(file, {
        scale,
        format,
        quality,
      });

      setProgress(80);
      setMessage("Packaging images...");

      if (results.length === 1) {
        const ext = format === "jpeg" ? "jpg" : "png";
        downloadImageBlob(results[0].blob, `page_1.${ext}`);
      } else {
        const zip = new JSZip();
        const ext = format === "jpeg" ? "jpg" : "png";
        results.forEach((r) => {
          zip.file(`page_${r.pageNum}.${ext}`, r.blob);
        });
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadZip(zipBlob, `${file.name.replace(".pdf", "")}_images.zip`);
      }

      setResultCount(results.length);
      setProgress(100);
      setState("done");
      setMessage(`${results.length} page${results.length > 1 ? "s" : ""} exported as ${format.toUpperCase()}!`);
    } catch (err) {
      setState("error");
      setMessage("Conversion failed. Try a lower scale.");
    }
  };

  return (
    <ToolPageLayout
      title="PDF to Image"
      description="Render every page of your PDF as high-quality PNG or JPG images."
      icon={<FileImage className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to convert"
            sublabel="Each page becomes a separate image"
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
              <label className="text-sm font-body text-bolt-muted block mb-2">
                Output format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["png", "jpeg"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-3 rounded-xl border text-sm font-body transition-all ${
                      format === f
                        ? "bg-bolt-accent/10 border-bolt-accent text-bolt-accent"
                        : "bg-bolt-elevated border-bolt-border text-bolt-muted hover:border-bolt-accent/40"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-2">
                Resolution: {scale}x ({scale === 1 ? "72 DPI" : scale === 2 ? "150 DPI" : "300 DPI"})
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 1, label: "1x — Fast" },
                  { value: 2, label: "2x — Standard" },
                  { value: 4, label: "4x — HD" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setScale(opt.value)}
                    className={`py-3 rounded-xl border text-sm font-body transition-all ${
                      scale === opt.value
                        ? "bg-bolt-accent/10 border-bolt-accent text-bolt-accent"
                        : "bg-bolt-elevated border-bolt-border text-bolt-muted hover:border-bolt-accent/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {format === "jpeg" && (
              <div>
                <label className="text-sm font-body text-bolt-muted block mb-2">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-bolt-accent"
                />
              </div>
            )}
          </div>
        )}

        <ProcessingState state={state} message={message} progress={progress} />

        {file && state !== "processing" && (
          <button
            onClick={handleConvert}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileImage className="w-5 h-5" />
            Convert to {format.toUpperCase()}
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
