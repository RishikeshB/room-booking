"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type User = {
  _id: string;
  username: string;
  role: "admin" | "user";
};

type DraftState = Record<string, { username: string; role: "admin" | "user"; password: string }>;

export function UserManager({ users }: { users: User[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftState>(
    Object.fromEntries(
      users.map((user) => [user._id, { username: user.username, role: user.role, password: "" }])
    )
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  async function saveUser(userId: string) {
    setSavingId(userId);

    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drafts[userId])
    });

    const data = await response.json();
    setSavingId(null);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to update user");
      return;
    }

    toast.success("User updated");
    setDrafts((current) => ({
      ...current,
      [userId]: {
        ...current[userId],
        password: ""
      }
    }));
    router.refresh();
  }

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Access roster</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Users</h2>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-900">{users.length} total</span>
      </div>
      <div className="mt-4 space-y-4">
        {users.map((user) => (
          <div className="rounded-3xl border border-brand-100 bg-white p-4" key={user._id}>
            <div className="grid gap-3 md:grid-cols-[1.1fr_0.7fr_1fr_auto] md:items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Username</label>
                <Input value={drafts[user._id]?.username ?? user.username} onChange={(event) => setDrafts((current) => ({ ...current, [user._id]: { ...(current[user._id] ?? { username: user.username, role: user.role, password: "" }), username: event.target.value } }))} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role</label>
                <Select value={drafts[user._id]?.role ?? user.role} onChange={(event) => setDrafts((current) => ({ ...current, [user._id]: { ...(current[user._id] ?? { username: user.username, role: user.role, password: "" }), role: event.target.value as "admin" | "user" } }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Reset password</label>
                <Input placeholder="Optional new password" type="password" value={drafts[user._id]?.password ?? ""} onChange={(event) => setDrafts((current) => ({ ...current, [user._id]: { ...(current[user._id] ?? { username: user.username, role: user.role, password: "" }), password: event.target.value } }))} />
              </div>
              <Button className="md:min-w-28" disabled={savingId === user._id} onClick={() => saveUser(user._id)} type="button">
                {savingId === user._id ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}