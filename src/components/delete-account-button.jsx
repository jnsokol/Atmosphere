"use client";

import { deleteAccount } from "@/server/actions/account";

export default function DeleteAccountButton() {
  async function handleDelete() {
    if (!confirm("This will permanently delete your account and all data. Are you sure?")) return;
    await deleteAccount();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="w-full rounded-md border border-red-500/30 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
    >
      Delete my account and all data
    </button>
  );
}
