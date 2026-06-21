"use client";

import { useState } from "react";
import { FileText, Copy, Check, Download } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";

export default function ExtractTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExtract = async () => {
    if (!file) return;
    setState("processing");
    setMessage("Extracting text from PDF...");
    setProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        fullText += `--- Page ${i} ---
${pageText}

`;
        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      setExtractedText(fullText.trim());
      setState("done");
      setMessage(`Extracted text from ${pdf.numPages} pages`);
    } catch (err) {
      setState("error");
      setMessage("Extraction failed. The PDF might be image-based (try OCR tool).");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "") || "extracted"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      title="Extract Text"
      description="Pull all text content from a PDF. Great for digitizing documents."
      icon={<FileText className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to extract text"
            sublabel="Works with text-based PDFs"
          />
        ) : (
          <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-semibold">{file.name}</p>
                <p className="text-sm font-body text-bolt-muted">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => { setFile(null); setState("idle"); setExtractedText(""); }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>
          </div>
        )}

        <ProcessingState state={state} message={message} progress={progress} />

        {extractedText && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-body text-bolt-muted">
                {extractedText.length.toLocaleString()} characters extracted
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-bolt-elevated border border-bolt-border rounded-lg text-xs font-body text-bolt-muted hover:text-bolt-accent hover:border-bolt-accent/40 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-2 px-4 py-2 bg-bolt-elevated border border-bolt-border rounded-lg text-xs font-body text-bolt-muted hover:text-bolt-accent hover:border-bolt-accent/40 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  .txt
                </button>
              </div>
            </div>
            <div className="bg-bolt-bg border border-bolt-border rounded-2xl p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm font-body text-bolt-text whitespace-pre-wrap leading-relaxed">
                {extractedText}
              </pre>
            </div>
          </div>
        )}

        {file && !extractedText && state !== "processing" && (
          <button
            onClick={handleExtract}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Extract Text
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
