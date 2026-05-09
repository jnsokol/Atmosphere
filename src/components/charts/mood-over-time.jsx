"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function MoodOverTimeChart({ data }) {
  return (
    <div>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <YAxis domain={[1, 10]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
          itemStyle={{ color: "#fff" }}
        />
        <Line type="monotone" dataKey="mood" stroke="#7cb9e8" strokeWidth={2} dot={false} name="Mood" />
        <Line type="monotone" dataKey="energy" stroke="#9b6b9e" strokeWidth={2} dot={false} name="Energy" />
      </LineChart>
    </ResponsiveContainer>
  );
}
