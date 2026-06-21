"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { rotatePdf, downloadBlob } from "@/lib/pdf-utils";

export default function RotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleRotate = async () => {
    if (!file) return;
    setState("processing");
    setMessage("Rotating pages...");

    try {
      const result = await rotatePdf(file, angle);
      downloadBlob(result, `rotated_${file.name}`);
      setState("done");
      setMessage("Rotation complete!");
    } catch (err) {
      setState("error");
      setMessage("Rotation failed.");
    }
  };

  return (
    <ToolPageLayout
      title="Rotate PDF"
      description="Rotate all pages in your PDF to the correct orientation."
      icon={<RotateCw className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to rotate"
          />
        ) : (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-6">
            <p className="font-sans font-semibold mb-4">{file.name}</p>
            <div className="grid grid-cols-3 gap-3">
              {([90, 180, 270] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAngle(a)}
                  className={`py-4 rounded-xl border text-sm font-body transition-all ${
                    angle === a
                      ? "bg-bolt-accent/10 border-bolt-accent text-bolt-accent"
                      : "bg-bolt-elevated border-bolt-border text-bolt-muted hover:border-bolt-accent/40"
                  }`}
                >
                  {a}°
                </button>
              ))}
            </div>
            <button
              onClick={() => { setFile(null); setState("idle"); }}
              className="mt-4 text-xs font-body text-bolt-accent hover:underline"
            >
              Change file
            </button>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && state !== "processing" && (
          <button
            onClick={handleRotate}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <RotateCw className="w-5 h-5" />
            Rotate {angle}°
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
