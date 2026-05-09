"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MoodVsTemperatureChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ScatterChart margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="temp"
          name="Temp"
          unit="°"
          type="number"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          tickLine={false}
          label={{ value: "Temperature (°C)", position: "insideBottom", offset: -2, fill: "rgba(255,255,255,0.2)", fontSize: 10 }}
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
          labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}
          itemStyle={{ fontSize: 11, fontWeight: 600 }}
          formatter={(val, name) => [val, name === "temp" ? "Temp (°C)" : "Mood"]}
        />
        <Scatter data={data} fill="#f4a261" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
