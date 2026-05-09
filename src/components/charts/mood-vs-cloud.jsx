"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function CloudTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { mood, cloud } = payload[0].payload;
  return (
    <div style={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", fontSize: 11 }}>
      <p style={{ color: "#7cb9e8", fontWeight: 600, margin: 0 }}>Mood: {mood}</p>
      <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, margin: "4px 0 0" }}>Cloud cover: {cloud}%</p>
    </div>
  );
}

export default function MoodVsCloudChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="cloud"
          name="Cloud cover"
          unit="%"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
        />
        <YAxis
          dataKey="mood"
          name="Mood"
          domain={[1, 10]}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip content={<CloudTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill="#9b6b9e" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
