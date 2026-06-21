"use client";

import { useState, useEffect } from "react";
import { Globe, Download, Shuffle, ArrowDownAZ } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import PdfPageViewer from "@/components/PdfPageViewer";
import DragDropList from "@/components/DragDropList";
import ProcessingState from "@/components/ProcessingState";
import { reorderPdf, getPdfPageCount, deletePages, downloadBlob } from "@/lib/pdf-utils";

export default function ReorderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [mode, setMode] = useState<"reorder" | "delete">("reorder");
  const [view, setView] = useState<"visual" | "list">("visual");
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (file) {
      getPdfPageCount(file).then((count) => {
        setPageCount(count);
        setPageOrder(Array.from({ length: count }, (_, i) => i + 1));
      });
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;
    setState("processing");

    try {
      if (mode === "delete" && selectedDelete.length > 0) {
        setMessage(`Removing ${selectedDelete.length} pages...`);
        const result = await deletePages(file, selectedDelete);
        downloadBlob(result, `edited_${file.name}`);
      } else {
        setMessage("Reordering pages...");
        const result = await reorderPdf(file, pageOrder);
        downloadBlob(result, `reordered_${file.name}`);
      }
      setState("done");
      setMessage("Done!");
    } catch (err) {
      setState("error");
      setMessage("Operation failed.");
    }
  };

  const listItems = pageOrder.map((p) => ({
    id: p,
    label: `Page ${p}`,
    sublabel: `Position ${pageOrder.indexOf(p) + 1}`,
  }));

  return (
    <ToolPageLayout
      title="Reorder & Edit Pages"
      description="Drag to rearrange, select pages to delete, or reverse the order."
      icon={<Globe className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to edit"
            sublabel="Visual page editor"
          />
        ) : (
          <div className="space-y-5">
            <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold">{file.name}</p>
                <p className="text-sm font-body text-bolt-muted">
                  {pageCount} pages · {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setPageOrder([]); setState("idle"); setSelectedDelete([]); }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("reorder")}
                className={`py-3 rounded-xl border text-sm font-body transition-all ${
                  mode === "reorder"
                    ? "bg-bolt-accent/10 border-bolt-accent text-bolt-accent"
                    : "bg-bolt-elevated border-bolt-border text-bolt-muted"
                }`}
              >
                Reorder Pages
              </button>
              <button
                onClick={() => setMode("delete")}
                className={`py-3 rounded-xl border text-sm font-body transition-all ${
                  mode === "delete"
                    ? "bg-red-500/10 border-red-500/50 text-red-400"
                    : "bg-bolt-elevated border-bolt-border text-bolt-muted"
                }`}
              >
                Delete Pages
              </button>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setPageOrder([...pageOrder].reverse())}
                className="flex items-center gap-2 px-4 py-2 bg-bolt-elevated border border-bolt-border rounded-lg text-xs font-body text-bolt-muted hover:text-bolt-accent hover:border-bolt-accent/40 transition-colors"
              >
                <Shuffle className="w-3 h-3" />
                Reverse order
              </button>
              <button
                onClick={() => setPageOrder(Array.from({ length: pageCount }, (_, i) => i + 1))}
                className="flex items-center gap-2 px-4 py-2 bg-bolt-elevated border border-bolt-border rounded-lg text-xs font-body text-bolt-muted hover:text-bolt-accent hover:border-bolt-accent/40 transition-colors"
              >
                <ArrowDownAZ className="w-3 h-3" />
                Reset
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setView("visual")}
                className={`px-4 py-2 rounded-lg text-xs font-body transition-all ${
                  view === "visual"
                    ? "bg-bolt-accent/10 text-bolt-accent border border-bolt-accent/30"
                    : "text-bolt-muted border border-bolt-border hover:border-bolt-accent/30"
                }`}
              >
                Visual
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-lg text-xs font-body transition-all ${
                  view === "list"
                    ? "bg-bolt-accent/10 text-bolt-accent border border-bolt-accent/30"
                    : "text-bolt-muted border border-bolt-border hover:border-bolt-accent/30"
                }`}
              >
                List
              </button>
            </div>

            {mode === "delete" ? (
              <div>
                <p className="text-sm font-body text-bolt-muted mb-3">
                  Select pages to delete ({selectedDelete.length} selected)
                </p>
                <PdfPageViewer
                  file={file}
                  selectedPages={selectedDelete}
                  onPageSelect={setSelectedDelete}
                  selectable
                />
              </div>
            ) : view === "visual" ? (
              <PdfPageViewer file={file} />
            ) : (
              <DragDropList
                items={listItems}
                onReorder={setPageOrder}
              />
            )}
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && state !== "processing" && (
          <button
            onClick={handleSave}
            className={`w-full font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
              mode === "delete" && selectedDelete.length > 0
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg"
            }`}
          >
            <Download className="w-5 h-5" />
            {mode === "delete" && selectedDelete.length > 0
              ? `Delete ${selectedDelete.length} pages & download`
              : "Download reordered PDF"}
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
