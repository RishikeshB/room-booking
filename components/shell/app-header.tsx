import Link from "next/link";

import { LogoutButton } from "@/components/shell/logout-button";

export function AppHeader({ title, subtitle, role }: { title: string; subtitle: string; role: "admin" | "user" }) {
  return (
    <header className="panel mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
          <span>Room Booking HQ</span>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-900">{role}</span>
        </div>
        <h1 className="text-3xl font-semibold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link className="rounded-2xl bg-brand-100 px-4 py-2.5 text-sm font-semibold text-brand-900 transition hover:bg-brand-200" href="/admin">Dashboard</Link>
        <LogoutButton />
      </div>
    </header>
  );
}

