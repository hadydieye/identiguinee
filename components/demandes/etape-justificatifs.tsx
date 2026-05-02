"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { TypeDocument, DOCUMENTS_REQUIS } from "@/lib/types";

export type JustificatifFile = {
  file: File;
  url?: string;
  uploading?: boolean;
};

export function EtapeJustificatifs({
  typeDocument,
  files,
  onFilesChange,
  onNext,
  onBack,
}: {
  typeDocument: TypeDocument;
  files: JustificatifFile[];
  onFilesChange: (files: JustificatifFile[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const addFiles = async (newFiles: FileList) => {
    setError("");
    const toAdd: JustificatifFile[] = [];
    for (const f of Array.from(newFiles)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
        setError("Formats acceptés : JPG, PNG, WEBP (images uniquement)");
        continue;
      }
      if (f.size > 5 * 1024 * 1024) {
        setError("Taille max : 5 MB par fichier");
        continue;
      }
      toAdd.push({ file: f, uploading: true });
    }
    if (!toAdd.length) return;

    const updated = [...files, ...toAdd];
    onFilesChange(updated);

    const results = await Promise.all(
      toAdd.map(async (jf) => {
        const fd = new FormData();
        fd.append("file", jf.file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) { setError((await res.json()).error ?? "Erreur upload"); return null; }
        return (await res.json()).path as string;
      })
    );

    onFilesChange(
      updated.map((jf, i) => {
        const idx = i - (files.length);
        if (idx >= 0 && idx < toAdd.length) {
          return { ...jf, uploading: false, url: results[idx] ?? undefined };
        }
        return jf;
      })
    );
  };

  const remove = (i: number) => onFilesChange(files.filter((_, idx) => idx !== i));

  const canProceed = files.length > 0 && files.every((f) => !f.uploading && f.url);

  return (
    <div className="space-y-6">
      {/* Documents requis */}
      <div className="bg-[#0D1117] border border-white/10 rounded-xl p-5">
        <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">Documents requis</h3>
        <ul className="space-y-1.5">
          {DOCUMENTS_REQUIS[typeDocument].map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-sm text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009460] flex-shrink-0" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all ${
          dragging ? "border-[#009460] bg-[#009460]/5" : "border-white/10 hover:border-white/20"
        }`}
      >
        <Upload className={`w-8 h-8 ${dragging ? "text-[#009460]" : "text-white/30"}`} />
        <div className="text-center">
          <p className="text-white/70 text-sm">Glissez vos fichiers ici ou cliquez pour parcourir</p>
          <p className="text-white/30 text-xs mt-1">JPG, PNG, WEBP — max 5 MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-[#CE1126] text-sm">{error}</p>}

      {/* Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((jf, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-[#0D1117] border border-white/10 rounded-lg px-4 py-3"
            >
              <FileText className="w-4 h-4 text-[#009460] flex-shrink-0" />
              <span className="text-white/80 text-sm flex-1 truncate">{jf.file.name}</span>
              {jf.uploading ? (
                <span className="text-white/30 text-xs">Upload...</span>
              ) : (
                <span className="text-[#009460] text-xs">✓</span>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="text-white/30 hover:text-[#CE1126] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:border-white/40 transition-colors text-sm font-medium"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 py-3 rounded-xl bg-[#009460] hover:bg-[#009460]/90 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Suivant → Confirmation
        </button>
      </div>
    </div>
  );
}
