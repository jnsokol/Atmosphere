const EMOJI = { Clear:"☀️", Clouds:"☁️", Rain:"🌧️", Drizzle:"🌦️", Thunderstorm:"⛈️", Snow:"❄️", Mist:"🌫️", Fog:"🌫️", Haze:"🌫️" };

export default function WeatherChip({ weather }) {
  if (!weather) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs text-white/60">
      {EMOJI[weather.condition] ?? "🌡️"}
      <span>{Math.round(weather.temp_c)}°C</span>
      <span className="text-white/25">·</span>
      <span>{weather.condition}</span>
    </span>
  );
}
