"use client";

import { useState } from "react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? "#006B3C" : "#2a2a4a" }}
    >
      <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: checked ? "calc(100% - 18px)" : "2px" }} />
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-4" style={{ background: "#1A1A2E" }}>
      <div className="text-white text-sm font-semibold">{title}</div>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[#d1d5db] text-sm">{label}</div>
        {desc && <div className="text-[#6b7280] text-xs mt-0.5">{desc}</div>}
      </div>
      <Toggle checked={value} onChange={onChange} />
    </div>
  );
}

export default function ParametresPage() {
  const [s, setS] = useState({
    auth2fa: true, sessionTimeout: true, ipWhitelist: false,
    autoSign: true, hashVerif: true, blockchainSync: true,
    emailNotif: true, smsNotif: false, alerteCritique: true,
    maintenanceMode: false, debugLogs: false, publicVerif: true,
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof typeof s) {
    setS((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      <h1 className="text-white text-xl font-bold">Paramètres</h1>

      <Card title="Sécurité">
        <ToggleRow label="Authentification 2FA" desc="Exiger la double authentification pour les admins" value={s.auth2fa} onChange={() => toggle("auth2fa")} />
        <ToggleRow label="Expiration de session" desc="Déconnecter après 30 min d'inactivité" value={s.sessionTimeout} onChange={() => toggle("sessionTimeout")} />
        <ToggleRow label="Liste blanche IP" desc="Restreindre l'accès admin aux IPs autorisées" value={s.ipWhitelist} onChange={() => toggle("ipWhitelist")} />
      </Card>

      <Card title="Blockchain">
        <ToggleRow label="Signature automatique" desc="Signer automatiquement les documents certifiés" value={s.autoSign} onChange={() => toggle("autoSign")} />
        <ToggleRow label="Vérification de hash" desc="Vérifier l'intégrité à chaque lecture" value={s.hashVerif} onChange={() => toggle("hashVerif")} />
        <ToggleRow label="Synchronisation NaissanceChain" desc="Maintenir la synchronisation en temps réel" value={s.blockchainSync} onChange={() => toggle("blockchainSync")} />
      </Card>

      <Card title="Notifications">
        <ToggleRow label="Notifications email" desc="Recevoir les alertes par email" value={s.emailNotif} onChange={() => toggle("emailNotif")} />
        <ToggleRow label="Notifications SMS" desc="Recevoir les alertes critiques par SMS" value={s.smsNotif} onChange={() => toggle("smsNotif")} />
        <ToggleRow label="Alertes critiques" desc="Notifier immédiatement pour les anomalies" value={s.alerteCritique} onChange={() => toggle("alerteCritique")} />
      </Card>

      <Card title="Général">
        <ToggleRow label="Mode maintenance" desc="Désactiver l'accès citoyen temporairement" value={s.maintenanceMode} onChange={() => toggle("maintenanceMode")} />
        <ToggleRow label="Logs de débogage" desc="Activer les logs détaillés (impact performance)" value={s.debugLogs} onChange={() => toggle("debugLogs")} />
        <ToggleRow label="Vérification publique" desc="Permettre la vérification sans compte" value={s.publicVerif} onChange={() => toggle("publicVerif")} />
      </Card>

      <Card title="Clés API">
        {[{ label: "Clé publique Supabase", value: "sb_pub_••••••••••••••••••••••••" }, { label: "Service Role Key", value: "sb_srv_••••••••••••••••••••••••" }, { label: "Secret interne", value: "int_••••••••••••••••••••••••" }].map((k) => (
          <div key={k.label}>
            <div className="text-[#6b7280] text-xs mb-1">{k.label}</div>
            <div className="px-3 py-2 rounded-lg font-mono text-xs text-[#9ca3af]" style={{ background: "#0D0D1A" }}>{k.value}</div>
          </div>
        ))}
      </Card>

      <div className="flex items-center gap-3">
        <button onClick={save} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#006B3C] text-white hover:bg-[#00E87A] transition-colors">
          Enregistrer
        </button>
        {saved && <span className="text-[#00E87A] text-sm">✓ Paramètres enregistrés</span>}
      </div>
    </div>
  );
}
