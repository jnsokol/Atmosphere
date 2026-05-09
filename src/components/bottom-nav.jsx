"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, PenLine, Clock, BarChart2, User } from "lucide-react";

const ITEMS = [
  { href: "/dashboard", Icon: LayoutDashboard, label: "Home"     },
  { href: "/log",       Icon: PenLine,         label: "Log"      },
  { href: "/history",   Icon: Clock,           label: "History"  },
  { href: "/insights",  Icon: BarChart2,       label: "Insights" },
  { href: "/profile",   Icon: User,            label: "Profile"  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [popping, setPopping] = useState(null);

  function handleClick(href) {
    setPopping(href);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-atmosphere-night/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2">
        {ITEMS.map(({ href, Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const isPopping = popping === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => handleClick(href)}
              className={`relative flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                active ? "text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-gradient-to-r from-atmosphere-day to-atmosphere-dusk" />
              )}
              <span
                className={isPopping ? "animate-nav-pop" : ""}
                onAnimationEnd={() => setPopping(null)}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              </span>
              <span className={`text-[10px] font-medium ${active ? "text-atmosphere-day" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
