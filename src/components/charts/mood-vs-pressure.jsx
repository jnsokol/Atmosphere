"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function MoodVsPressureChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="pressure"
          name="Pressure"
          unit=" hPa"
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
        <Tooltip
          contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          itemStyle={{ fontSize: 11 }}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Scatter data={data} fill="#f5d7b8" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
