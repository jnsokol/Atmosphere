"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenLine, Clock, BarChart2, User, BookOpen } from "lucide-react";

const NAV = [
  { href: "/dashboard", Icon: LayoutDashboard, label: "Home"     },
  { href: "/log",       Icon: PenLine,         label: "Log"      },
  { href: "/journal",   Icon: BookOpen,        label: "Journal"  },
  { href: "/history",   Icon: Clock,           label: "History"  },
  { href: "/insights",  Icon: BarChart2,       label: "Insights" },
  { href: "/profile",   Icon: User,            label: "Profile"  },
];

export default function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, Icon, label }) => {
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
            <Icon size={17} strokeWidth={active ? 2 : 1.5} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
