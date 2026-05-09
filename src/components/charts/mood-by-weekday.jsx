"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MoodByWeekdayChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
          <YAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
            itemStyle={{ fontSize: 12 }}
            formatter={(v, name, props) => [`${v ?? "—"} (n=${props.payload.n})`, name]}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="avg"        name="Mood"   fill="#7cb9e8" fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Bar dataKey="avgEnergy"  name="Energy" fill="#9b6b9e" fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={16} />
          <Bar dataKey="avgStress"  name="Stress" fill="#f87171" fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={16} />
        </BarChart>
    </ResponsiveContainer>
  );
}
