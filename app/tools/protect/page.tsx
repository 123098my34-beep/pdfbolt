"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropZone from "@/components/FileDropZone";
import ProcessingState from "@/components/ProcessingState";
import { protectPdf, downloadBlob } from "@/lib/pdf-utils";

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: false,
    modifying: false,
    annotating: true,
  });
  const [state, setState] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleProtect = async () => {
    if (!file) return;
    if (password.length < 4) {
      setState("error");
      setMessage("Password must be at least 4 characters");
      return;
    }
    if (password !== confirmPassword) {
      setState("error");
      setMessage("Passwords don't match");
      return;
    }

    setState("processing");
    setMessage("Encrypting PDF...");

    try {
      const result = await protectPdf(file, password, undefined, permissions);
      downloadBlob(result, `protected_${file.name}`);
      setState("done");
      setMessage("PDF protected and downloaded!");
    } catch (err) {
      setState("error");
      setMessage("Encryption failed.");
    }
  };

  return (
    <ToolPageLayout
      title="Protect PDF"
      description="Encrypt your PDF with a password and control what others can do with it."
      icon={<Lock className="w-6 h-6 text-bolt-accent" />}
    >
      <div className="space-y-6">
        {!file ? (
          <FileDropZone
            multiple={false}
            accept=".pdf"
            onFiles={(f) => setFile(f[0])}
            label="Drop a PDF to protect"
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
                onClick={() => { setFile(null); setState("idle"); setPassword(""); setConfirmPassword(""); }}
                className="text-xs font-body text-bolt-accent hover:underline"
              >
                Change file
              </button>
            </div>

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full bg-bolt-bg border border-bolt-border rounded-xl px-4 py-3 pr-12 font-body text-sm text-bolt-text placeholder:text-bolt-muted/50 focus:outline-none focus:border-bolt-accent/40 transition-colors"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bolt-muted hover:text-bolt-accent transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-2">
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`w-full bg-bolt-bg border rounded-xl px-4 py-3 font-body text-sm text-bolt-text placeholder:text-bolt-muted/50 focus:outline-none transition-colors ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-bolt-border focus:border-bolt-accent/40"
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 font-body mt-1">Passwords don't match</p>
              )}
            </div>

            {password && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-bolt-elevated rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      password.length < 4
                        ? "w-1/4 bg-red-500"
                        : password.length < 8
                        ? "w-2/4 bg-yellow-500"
                        : password.length < 12
                        ? "w-3/4 bg-bolt-accent"
                        : "w-full bg-green-500"
                    }`}
                  />
                </div>
                <span className="text-xs font-body text-bolt-muted">
                  {password.length < 4
                    ? "Weak"
                    : password.length < 8
                    ? "Fair"
                    : password.length < 12
                    ? "Strong"
                    : "Very strong"}
                </span>
              </div>
            )}

            <div>
              <label className="text-sm font-body text-bolt-muted block mb-3">
                <Shield className="w-4 h-4 inline mr-1" />
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(permissions).map(([key, val]) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 bg-bolt-elevated border border-bolt-border rounded-xl px-4 py-3 cursor-pointer hover:border-bolt-accent/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) =>
                        setPermissions({ ...permissions, [key]: e.target.checked })
                      }
                      className="w-4 h-4 accent-bolt-accent"
                    />
                    <span className="text-sm font-body text-bolt-muted capitalize">
                      {key}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <ProcessingState state={state} message={message} />

        {file && state !== "processing" && (
          <button
            onClick={handleProtect}
            disabled={!password || password !== confirmPassword}
            className="w-full bg-bolt-accent hover:bg-bolt-accentHover disabled:opacity-40 disabled:cursor-not-allowed text-bolt-bg font-sans font-semibold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Protect PDF
          </button>
        )}
      </div>
    </ToolPageLayout>
  );
}
