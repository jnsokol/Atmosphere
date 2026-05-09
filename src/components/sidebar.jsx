"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenLine, Clock, BarChart2, User, BookOpen, LogOut } from "lucide-react";
import { signOut } from "@/server/actions/auth";

const ITEMS = [
  { href: "/dashboard", Icon: LayoutDashboard, label: "Home"     },
  { href: "/log",       Icon: PenLine,         label: "Log"      },
  { href: "/journal",   Icon: BookOpen,        label: "Journal"  },
  { href: "/history",   Icon: Clock,           label: "History"  },
  { href: "/insights",  Icon: BarChart2,       label: "Insights" },
  { href: "/profile",   Icon: User,            label: "Profile"  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-dvh w-56 flex-col border-r border-white/[0.06] bg-atmosphere-night z-40 px-4 py-6">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 mb-8">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-atmosphere-day via-atmosphere-dusk to-atmosphere-dusk opacity-90 shadow-glow-sm" />
        <span className="font-display text-[17px] font-bold tracking-tight bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk bg-clip-text text-transparent">
          Atmosphere
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {ITEMS.map(({ href, Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <form action={signOut}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </form>
    </aside>
  );
}
