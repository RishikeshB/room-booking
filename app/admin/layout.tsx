import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/shell/app-header";
import { getServerSession } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="space-y-6 px-4 py-6 lg:px-6">
      <AppHeader role={session.role} subtitle="Create hotels, assign room inventory, and monitor occupancy across every property." title="Dashboard" />
      {children}
    </main>
  );
}

