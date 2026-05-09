"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CONDITION_COLORS = {
  Clear:        "#f4a261",
  "Partly cloudy": "#7cb9e8",
  Cloudy:       "#9b9eb8",
  Overcast:     "#6b7280",
  Rain:         "#60a5fa",
  Drizzle:      "#93c5fd",
  Snow:         "#e2e8f0",
  Thunderstorm: "#a78bfa",
  Fog:          "#94a3b8",
};

export default function MoodByWeatherChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 24, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="condition"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
        />
        <YAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
          itemStyle={{ color: "#fff", fontSize: 12 }}
          formatter={(val, name) => [val ?? "—", "Avg mood"]}
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Bar dataKey="avg" name="Avg mood" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.condition} fill={CONDITION_COLORS[entry.condition] ?? "#7cb9e8"} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
