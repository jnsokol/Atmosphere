"use client";

export default function AppError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <span className="text-5xl">⚡</span>
      <div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="mt-1.5 text-sm text-white/40 max-w-xs mx-auto">{error?.message ?? "An unexpected error occurred."}</p>
      </div>
      <button onClick={reset} className="btn-primary px-6 py-2.5 text-sm">
        Try again
      </button>
    </div>
  );
}
