"use client";

import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#00E87A", "#F6AD55", "#3B82F6", "#EF4444"];

export function DashboardAreaChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00E87A" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00E87A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "#1A1A2E", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
        <Area type="monotone" dataKey="count" stroke="#00E87A" fill="url(#grad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DashboardPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: "#1A1A2E", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
