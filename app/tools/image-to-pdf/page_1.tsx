"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { imagesToPdf, downloadBlob } from "@/lib/pdf-utils";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleConvert = async () => {
    if (files.length === 0) return;
    setState("processing");
    setMessage("Converting images to PDF...");

    try {
      const result = await imagesToPdf(files);
      downloadBlob(result, "converted.pdf");
      setState("done");
      setMessage(`${files.length} image${files.length > 1 ? "s" : ""} converted!`);
    } catch (err) {
      setState("error");
      setMessage("Conversion failed. Make sure files are valid images.");
    }
  };

  return (
    <ToolPageLayout
      title="Image to PDF"
      description="Convert JPG, PNG, and other images into a single PDF document."
      icon={<FileText className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        <FileDropZone
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onFiles={(f) => setFiles((prev) => [...prev, ...f])}
          label="Drop images here"
          sublabel="PNG, JPG, WEBP supported"
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-body text-bolt-muted">
                {files.length} image{files.length !== 1 ? "s" : ""}
              </p>
              <button onClick={() => setFiles([])} className="text-xs font-body text-bolt-danger hover:underline">
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {files.map((file, i) => (
                <div key={i} className="bg-bolt-surface border border-bolt-border rounded-xl p-4 text-center">
                  <p className="text-sm font-sans font-medium truncate">{file.name}</p>
                  <p className="text-xs font-body text-bolt-muted">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {files.length > 0 && state !== "processing" && (
          <button
            onClick={handleConvert}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Convert to PDF
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
