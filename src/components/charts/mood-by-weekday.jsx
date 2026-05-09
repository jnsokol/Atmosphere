"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MoodByWeekdayChart({ data }) {
  return (
    <div>
      <ChartLegend />
      <ResponsiveContainer width="100%" height={200}>
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
          <Bar dataKey="avg"        name="Mood"   fill="#7cb9e8" fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="avgEnergy"  name="Energy" fill="#9b6b9e" fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="flex gap-4 mb-2 pl-1">
      <span className="text-xs font-bold" style={{ color: "#7cb9e8" }}>Mood</span>
      <span className="text-xs font-bold" style={{ color: "#9b6b9e" }}>Energy</span>
    </div>
  );
}
