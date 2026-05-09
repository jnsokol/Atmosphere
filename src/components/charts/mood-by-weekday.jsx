"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export default function MoodByWeekdayChart({ data }) {
  const max = Math.max(...data.filter((d) => d.avg).map((d) => d.avg));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <YAxis domain={[0, 10]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
          itemStyle={{ color: "#fff" }}
          formatter={(v, _, props) => [`${v} (n=${props.payload.n})`, "Avg mood"]}
        />
        <Bar dataKey="avg" radius={[4, 4, 0, 0]} name="Avg mood">
          {data.map((d, i) => (
            <Cell key={i} fill={d.avg === max ? "#7cb9e8" : "rgba(124,185,232,0.35)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
