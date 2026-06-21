"use client";

import { Loader2, Check, AlertCircle } from "lucide-react";

interface ProcessingStateProps {
  state: "idle" | "processing" | "done" | "error";
  message?: string;
  progress?: number;
}

export default function ProcessingState({
  state,
  message,
  progress,
}: ProcessingStateProps) {
  if (state === "idle") return null;

  return (
    <div className="bg-bolt-surface border border-bolt-border rounded-2xl p-8 text-center">
      {state === "processing" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-bolt-accent animate-spin" />
          <p className="font-sans font-semibold">
            {message || "Processing..."}
          </p>
          {progress !== undefined && (
            <div className="w-full max-w-xs bg-bolt-elevated rounded-full h-2 overflow-hidden">
              <div
                className="processing-bar h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {state === "done" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <p className="font-sans font-semibold text-green-400">
            {message || "Done!"}
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="font-sans font-semibold text-red-400">
            {message || "Something went wrong"}
          </p>
        </div>
      )}
    </div>
  );
}
