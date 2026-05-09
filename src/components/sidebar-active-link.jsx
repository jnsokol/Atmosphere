"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarActiveLink({ href, label, Icon }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2 : 1.5} />
      {label}
    </Link>
  );
}
