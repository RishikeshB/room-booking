"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      toast.error("Unable to log out right now.");
      setLoading(false);
      return;
    }

    window.location.href = "/login";
  }

  return <Button variant="ghost" onClick={handleLogout} disabled={loading}>{loading ? "Signing out..." : "Logout"}</Button>;
}

