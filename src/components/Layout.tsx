import { Link, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import clsx from "classnames";
const tabs = [
  { to: "/fish", label: "Fish" },
  { to: "/collection", label: "Caught" },
  { to: "/missing", label: "Missing" },
  { to: "/regions", label: "Regions" },
];

export default function Layout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-sky-100 to-blue-50 text-slate-800">
      <header className="p-4 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tight text-sky-700">WanderFish</div>
        <nav className="flex gap-2">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={clsx(
                "px-3 py-2 rounded-full text-sm font-semibold transition shadow-sm",
                pathname === t.to ? "bg-sky-600 text-white shadow-sky-200" : "bg-white text-sky-700 hover:bg-sky-100"
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 pb-10">{children}</main>
    </div>
  );
}