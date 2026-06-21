"use client";

import { useState, useEffect } from "react";
import { Settings, Download, Info } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { getPdfMetadata, editPdfMetadata, downloadBlob } from "@/lib/pdf-utils";

export default function MetadataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState({
    title: "",
    author: "",
    subject: "",
    keywords: "",
  });
  const [originalMeta, setOriginalMeta] = useState<any>(null);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      setLoading(true);
      getPdfMetadata(file).then((m) => {
        const data = {
          title: m.title,
          author: m.author,
          subject: m.subject,
          keywords: m.keywords.join(", "),
        };
        setMeta(data);
        setOriginalMeta(m);
        setLoading(false);
      });
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;
    setState("processing");
    setMessage("Updating metadata...");

    try {
      const result = await editPdfMetadata(file, {
        title: meta.title,
        author: meta.author,
        subject: meta.subject,
        keywords: meta.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      });
      downloadBlob(result, `metadata_${file.name}`);
      setState("done");
      setMessage("Metadata updated!");
    } catch (err) {
      setState("error");
      setMessage("Failed to update metadata.");
    }
  };

  return (
    <ToolPageLayout
      title="Edit Metadata"
      description="View and edit PDF document properties — title, author, subject, keywords."
      icon={<Settings className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to edit metadata"
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
                onClick={() => { setFile(null); setState("idle"); setOriginalMeta(null); }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>

            {originalMeta && (
              <div className="bg-bolt-bg border border-bolt-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-bolt-muted" />
                  <span className="text-xs font-body text-bolt-muted">Current document info</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-body">
                  <div>
                    <span className="text-bolt-muted">Pages: </span>
                    <span className="text-bolt-text">{originalMeta.pageCount}</span>
                  </div>
                  <div>
                    <span className="text-bolt-muted">Producer: </span>
                    <span className="text-bolt-text">{originalMeta.producer || "None"}</span>
                  </div>
                  <div>
                    <span className="text-bolt-muted">Creator: </span>
                    <span className="text-bolt-text">{originalMeta.creator || "None"}</span>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm font-body text-bolt-muted">Reading metadata...</p>
              </div>
            ) : (
              <>
                {[
                  { key: "title" as const, label: "Title", placeholder: "Document title" },
                  { key: "author" as const, label: "Author", placeholder: "Author name" },
                  { key: "subject" as const, label: "Subject", placeholder: "Document subject" },
                  { key: "keywords" as const, label: "Keywords", placeholder: "Comma-separated keywords" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-body text-bolt-muted block mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={meta[field.key]}
                      onChange={(e) => setMeta({ ...meta, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full bg-bolt-bg border border-bolt-border rounded-xl px-4 py-3 font-body text-sm text-bolt-text placeholder:text-bolt-muted/50 focus:outline-none focus:border-bolt-accent/40 transition-colors"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && !loading && state !== "processing" && (
          <button
            onClick={handleSave}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Save & Download
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
