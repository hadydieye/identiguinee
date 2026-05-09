"use client";

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const barData = [
  { mois: "Jan", demandes: 210, certifiees: 195 },
  { mois: "Fév", demandes: 280, certifiees: 261 },
  { mois: "Mar", demandes: 340, certifiees: 318 },
  { mois: "Avr", demandes: 417, certifiees: 394 },
];

const pieData = [
  { name: "Conakry", value: 45 },
  { name: "Labé", value: 18 },
  { name: "Kankan", value: 15 },
  { name: "Kindia", value: 12 },
  { name: "Autres", value: 10 },
];

const lineData = [
  { sem: "S1", perf: 91 }, { sem: "S2", perf: 94 }, { sem: "S3", perf: 89 },
  { sem: "S4", perf: 96 }, { sem: "S5", perf: 93 }, { sem: "S6", perf: 97 },
];

const COLORS = ["#00E87A", "#3B82F6", "#F6AD55", "#EF4444", "#8B5CF6"];
const TOOLTIP_STYLE = { background: "#1A1A2E", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 };

const kpis = [
  { label: "Demandes ce mois", value: "1 247", color: "#3B82F6" },
  { label: "Taux de certification", value: "94.6%", color: "#00E87A" },
  { label: "Temps moyen", value: "1.8 min", color: "#F6AD55" },
  { label: "Satisfaction", value: "4.7/5", color: "#00E87A" },
];

export default function RapportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">Rapports</h1>
        <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#006B3C] text-white hover:bg-[#00E87A] transition-colors">
          Télécharger PDF
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
            <div className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[#9ca3af] text-sm mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-4">Évolution mensuelle</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
              <XAxis dataKey="mois" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="demandes" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Demandes" />
              <Bar dataKey="certifiees" fill="#00E87A" radius={[4, 4, 0, 0]} name="Certifiées" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
          <div className="text-white text-sm font-semibold mb-4">Répartition par région</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "#1A1A2E" }}>
        <div className="text-white text-sm font-semibold mb-4">Performance hebdomadaire (%)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
            <XAxis dataKey="sem" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[85, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
            <Line type="monotone" dataKey="perf" stroke="#00E87A" strokeWidth={2} dot={{ fill: "#00E87A", r: 4 }} name="Performance" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
