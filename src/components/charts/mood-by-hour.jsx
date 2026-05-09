"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = {
  Morning:   "#f4a261",
  Afternoon: "#7cb9e8",
  Evening:   "#9b6b9e",
  Night:     "#4a5568",
};

export default function MoodByHourChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="slot" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
          itemStyle={{ color: "#fff", fontSize: 12 }}
          formatter={(val, name) => [val ?? "—", name]}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="avg" name="Avg mood" radius={[6, 6, 0, 0]} maxBarSize={52}>
          {data.map((entry) => (
            <Cell key={entry.slot} fill={COLORS[entry.slot] ?? "#7cb9e8"} fillOpacity={entry.avg ? 0.85 : 0.2} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
