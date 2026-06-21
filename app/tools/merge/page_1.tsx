"use client";

import { useState } from "react";
import { Merge, Download, Plus } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { mergePdfs, downloadBlob } from "@/lib/pdf-utils";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleMerge = async () => {
    if (files.length < 2) {
      setState("error");
      setMessage("Select at least 2 PDF files to merge");
      return;
    }

    setState("processing");
    setMessage("Merging your PDFs...");

    try {
      const result = await mergePdfs(files);
      downloadBlob(result, "merged.pdf");
      setState("done");
      setMessage("PDFs merged successfully!");
    } catch (err) {
      setState("error");
      setMessage("Failed to merge PDFs. Make sure all files are valid.");
    }
  };

  return (
    <ToolPageLayout
      title="Merge PDFs"
      description="Combine multiple PDF files into a single document. Drag to reorder."
      icon={<Merge className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        <FileDropZone
          multiple
          accept=".pdf"
          onFiles={(f) => setFiles((prev) => [...prev, ...f])}
          label="Drop PDF files to merge"
          sublabel="Select 2 or more PDF files"
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-body text-bolt-muted">
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </p>
              <button
                onClick={() => setFiles([])}
                className="text-xs font-body text-bolt-danger hover:underline"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-4 bg-bolt-surface border border-bolt-border rounded-xl px-5 py-4"
                >
                  <span className="text-xs font-body text-bolt-accent bg-bolt-accent/10 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs font-body text-bolt-muted">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                    className="text-xs font-body text-bolt-muted hover:text-bolt-danger transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf";
                input.multiple = true;
                input.onchange = () => {
                  if (input.files) {
                    setFiles((prev) => [...prev, ...Array.from(input.files!)]);
                  }
                };
                input.click();
              }}
              className="w-full border border-dashed border-bolt-border rounded-xl py-4 flex items-center justify-center gap-2 text-sm font-body text-bolt-muted hover:text-bolt-accent hover:border-bolt-accent/40 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add more files
            </button>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {files.length >= 2 && state !== "processing" && (
          <button
            onClick={handleMerge}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Merge className="w-5 h-5" />
            Merge {files.length} PDFs
          </button>
        )}

        {state === "done" && (
          <button
            onClick={handleMerge}
            className="w-full bg-bolt-surface border border-bolt-border hover:border-bolt-accent/40 text-bolt-text font-sans font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download again
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
