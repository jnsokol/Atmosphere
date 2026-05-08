const CONDITION_EMOJI = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

export default function WeatherChip({ weather }) {
  if (!weather) return null;
  const emoji = CONDITION_EMOJI[weather.condition] ?? "🌡️";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
      {emoji}
      <span>{Math.round(weather.temp_c)}°C</span>
      <span className="text-white/40">·</span>
      <span>{weather.condition}</span>
      <span className="text-white/40">·</span>
      <span>{weather.pressure_hpa} hPa</span>
    </span>
  );
}
