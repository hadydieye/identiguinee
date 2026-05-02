"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";

type Result =
  | { resultat: "authentique"; citoyen: string; type_document: string; date: string; hash: string | null; bloc_number: string | null }
  | { resultat: "invalide" }
  | null;

const TYPE_LABELS: Record<string, string> = {
  acte_naissance: "Acte de naissance",
  cni: "Carte nationale d'identité",
  passeport: "Passeport",
  certificat_nationalite: "Certificat de nationalité",
};

export default function VerifierPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [scanActive, setScanActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<import("@zxing/browser").IScannerControls | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function verify(ref: string) {
    if (!ref.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/verifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref.trim() }),
      });
      setResult(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function startScanner() {
    setCameraError("");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    } catch {
      setCameraError("Autorisez l'accès à la caméra dans les paramètres de votre navigateur.");
      return;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    const { BrowserMultiFormatReader } = await import("@zxing/browser");
    const reader = new BrowserMultiFormatReader();
    setScanActive(true);
    try {
      const controls = await reader.decodeFromStream(stream, videoRef.current!, (res) => {
        if (res) {
          const text = res.getText();
          let ref = text;
          try { ref = new URL(text).searchParams.get("ref") ?? text; } catch { /* plain ref */ }
          setReference(ref);
          stopScanner();
          verify(ref);
        }
      });
      controlsRef.current = controls;
    } catch {
      setCameraError("Impossible d'accéder à la caméra.");
      setScanActive(false);
    }
  }

  function stopScanner() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setScanActive(false);
  }

  useEffect(() => () => { controlsRef.current?.stop(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { BrowserMultiFormatReader } = await import("@zxing/browser");
    const reader = new BrowserMultiFormatReader();
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      try {
        const res = await reader.decodeFromImageUrl(url);
        const text = res.getText();
        let ref = text;
        try { ref = new URL(text).searchParams.get("ref") ?? text; } catch { /* plain ref */ }
        setReference(ref);
        verify(ref);
      } catch {
        setCameraError("Aucun QR code détecté dans l'image.");
      } finally {
        URL.revokeObjectURL(url);
      }
    };
  }

  return (
    <div className="min-h-screen bg-[#06090F] px-4 py-12">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Vérifier un document</h1>
          <p className="text-white/50 mt-2 text-sm leading-relaxed">
            Scannez un QR code ou saisissez l&apos;identifiant blockchain pour vérifier
            l&apos;authenticité d&apos;un document.
          </p>
        </div>

        {/* Section 1 — Scanner QR */}
        <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Scanner un QR code</h2>

          {/* Scan zone */}
          <div className="rounded-xl border-2 border-dashed border-[#009460]/50 overflow-hidden min-h-[200px] flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover", display: scanActive ? "block" : "none", minHeight: "200px" }}
            />
            {!scanActive && (
              <div className="text-center py-8 space-y-3">
                <Camera className="w-10 h-10 text-[#009460]/50 mx-auto" />
                <p className="text-white/40 text-sm">Pointez la caméra vers le QR code du document</p>
              </div>
            )}
          </div>

          {cameraError && (
            <p className="text-[#CE1126] text-sm">{cameraError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={scanActive ? stopScanner : startScanner}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#009460] hover:bg-[#007a50] text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
              {scanActive ? "Arrêter la caméra" : "Activer la caméra"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-white/20 hover:border-white/40 text-white text-sm rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Importer une image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>

        {/* Section 2 — Saisie manuelle */}
        <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Saisie manuelle</h2>
          <div>
            <label className="block text-sm text-white/70 mb-1.5">Identifiant blockchain</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verify(reference)}
              placeholder="GN-2024-0042-7F3A"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#009460] transition-colors font-mono text-sm"
            />
            <p className="text-white/30 text-xs mt-1.5">
              Format : GN-AAAA-NNNN-XXXX (visible sur le document)
            </p>
          </div>
          <button
            onClick={() => verify(reference)}
            disabled={loading || !reference.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#FCD116] hover:bg-[#e6bc00] disabled:opacity-40 text-black font-semibold rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Vérification..." : "Vérifier l'authenticité"}
          </button>
        </div>

        {/* Section 3 — Résultat */}
        {result && (
          <div
            className={`rounded-2xl p-6 border ${
              result.resultat === "authentique"
                ? "bg-[#009460]/10 border-[#009460]/40"
                : "bg-[#CE1126]/10 border-[#CE1126]/40"
            }`}
          >
            {result.resultat === "authentique" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#009460] shrink-0" />
                  <h3 className="text-[#009460] font-bold text-lg">Document authentique ✓</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    ["Citoyen", result.citoyen],
                    ["Type", TYPE_LABELS[result.type_document] ?? result.type_document],
                    ["Date de délivrance", new Date(result.date).toLocaleDateString("fr-FR")],
                    ...(result.hash ? [["Hash blockchain", result.hash]] : []),
                    ...(result.bloc_number ? [["Bloc", result.bloc_number]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <span className="text-white/50">{k}</span>
                      <span className="text-white font-medium font-mono text-right break-all">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-[#CE1126] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#CE1126] font-bold text-lg">Document invalide</h3>
                  <p className="text-white/60 text-sm mt-1">
                    Ce document n&apos;existe pas dans NaissanceChain ou a été falsifié.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comment ça marche */}
        <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Comment ça marche ?</h2>
          <ol className="space-y-3">
            {[
              "Scannez ou saisissez l'identifiant du document",
              "Notre système interroge la blockchain NaissanceChain",
              "Le document est confirmé authentique ou rejeté en quelques secondes",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#009460]/20 text-[#009460] text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
