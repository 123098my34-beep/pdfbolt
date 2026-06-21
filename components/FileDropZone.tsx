"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { Upload, X, FileText, Check } from "lucide-react";

interface FileDropZoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  children?: ReactNode;
  label?: string;
  sublabel?: string;
}

export default function FileDropZone({
  accept = ".pdf",
  multiple = true,
  onFiles,
  children,
  label = "Drop your files here",
  sublabel = "or click to browse",
}: FileDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);
      setFiles(arr);
      onFiles(arr);
    },
    [onFiles]
  );

  return (
    <div
      className={`drop-zone rounded-2xl p-12 cursor-pointer transition-all duration-300 ${
        dragOver ? "drag-over" : ""
      } ${files.length > 0 ? "border-bolt-accent" : ""}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {children ? (
        children
      ) : files.length > 0 ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-bolt-accent" />
          </div>
          <div className="text-center">
            <p className="font-sans font-semibold">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
            <div className="mt-2 space-y-1">
              {files.map((f, i) => (
                <p key={i} className="text-xs font-body text-bolt-muted">
                  {f.name} ({(f.size / 1024 / 1024).toFixed(1)} MB)
                </p>
              ))}
            </div>
          </div>
          <button
            className="mt-2 text-xs font-body text-bolt-accent hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setFiles([]);
            }}
          >
            Choose different files
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-bolt-accent/10 border border-bolt-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7 text-bolt-accent" />
          </div>
          <div className="text-center">
            <p className="text-lg font-sans font-semibold mb-1">{label}</p>
            <p className="text-sm font-body text-bolt-muted">{sublabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
