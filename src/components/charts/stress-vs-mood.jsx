"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function StressMoodTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { mood, stress } = payload[0].payload;
  return (
    <div style={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
      <p style={{ color: "#7cb9e8", fontWeight: 600, margin: 0 }}>Mood: {mood}</p>
      <p style={{ color: "#f87171", fontWeight: 600, margin: "4px 0 0" }}>Stress: {stress}</p>
    </div>
  );
}

export default function StressVsMoodChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 16, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="stress"
          name="Stress"
          type="number"
          domain={[1, 10]}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
          label={{ value: "Stress", position: "insideBottom", offset: -4, fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
        />
        <YAxis
          dataKey="mood"
          name="Mood"
          domain={[1, 10]}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip content={<StressMoodTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#f87171" fillOpacity={0.55} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
