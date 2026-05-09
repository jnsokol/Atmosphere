"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function MoodVsEnergyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 16, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="energy"
          name="Energy"
          type="number"
          domain={[1, 10]}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
          label={{ value: "Energy", position: "insideBottom", offset: -4, fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
        />
        <YAxis
          dataKey="mood"
          name="Mood"
          domain={[1, 10]}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
          itemStyle={{ fontSize: 11 }}
          formatter={(val, name) => [val, name === "energy" ? "Energy" : "Mood"]}
        />
        <ReferenceLine stroke="rgba(255,255,255,0.06)" segment={[{ x: 1, y: 1 }, { x: 10, y: 10 }]} strokeDasharray="4 4" />
        <Scatter data={data} fill="#9b6b9e" fillOpacity={0.65} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
