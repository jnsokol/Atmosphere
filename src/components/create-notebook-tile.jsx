"use client";

import { useState } from "react";
import { createNotebook } from "@/server/actions/journal";

const COLORS = ["#7cb9e8","#9b6b9e","#4ade80","#f4a261","#f472b6","#f87171","#fbbf24","#2dd4bf"];

export default function CreateNotebookTile() {
  const [open, setOpen]       = useState(false);
  const [color, setColor]     = useState(COLORS[0]);
  const [pending, setPending] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="aspect-[3/4] rounded-2xl border border-dashed border-white/[0.1] flex flex-col items-center justify-center gap-3 hover:border-white/20 hover:bg-white/[0.02] transition-all active:scale-[0.98]"
      >
        <div className="h-12 w-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-white/25 text-3xl font-light leading-none">+</div>
        <p className="text-xs font-semibold text-white/25">New notebook</p>
      </button>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    fd.set("color", color);
    setPending(true);
    await createNotebook(fd);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="aspect-[3/4] rounded-2xl border border-white/[0.08] bg-white/[0.03] flex flex-col gap-2.5 px-3 py-4"
      style={{ borderTopColor: color, borderTopWidth: 2 }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 shrink-0">New notebook</p>

      <input
        name="name"
        placeholder="Name…"
        required
        autoFocus
        className="input text-sm py-2 px-3 w-full"
      />

      <div className="flex flex-wrap gap-1.5 shrink-0">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`h-5 w-5 rounded-full transition-all ${color === c ? "ring-2 ring-white/60 scale-110" : "opacity-60 hover:opacity-100"}`}
            style={{ background: c }}
          />
        ))}
      </div>

      <div className="flex gap-2 mt-auto shrink-0">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-2 rounded-xl text-xs text-white/40 bg-white/[0.04] hover:bg-white/[0.07] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-2 rounded-xl text-xs font-semibold bg-atmosphere-day/20 text-atmosphere-day hover:bg-atmosphere-day/30 transition-colors disabled:opacity-50"
        >
          {pending ? "…" : "Create"}
        </button>
      </div>
    </form>
  );
}
