"use client";

export default function AppError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p className="text-4xl">⚡</p>
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-sm text-white/50 max-w-sm">{error?.message ?? "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="mt-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-atmosphere-night hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
