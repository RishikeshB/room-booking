"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { UserManager } from "@/components/admin/user-manager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Hotel = {
  _id: string;
  name: string;
  location: string;
  description?: string;
  totalRooms: number;
  allocatedRooms: number;
  availableRooms: number;
};

type User = {
  _id: string;
  username: string;
  role: "admin" | "user";
};

export function DashboardClient({ hotels, users, role }: { hotels: Hotel[]; users: User[]; role: string }) {
  const router = useRouter();
  const [hotelForm, setHotelForm] = useState({ name: "", location: "", description: "" });
  const [userForm, setUserForm] = useState({ username: "", password: "", role: "user" });
  const [hotelLoading, setHotelLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const isAdmin = role === "admin";

  async function createHotel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHotelLoading(true);

    const response = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hotelForm)
    });

    const data = await response.json();
    setHotelLoading(false);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to create hotel");
      return;
    }

    toast.success("Hotel created");
    setHotelForm({ name: "", location: "", description: "" });
    router.refresh();
  }

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUserLoading(true);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm)
    });

    const data = await response.json();
    setUserLoading(false);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to create user");
      return;
    }

    toast.success("User created");
    setUserForm({ username: "", password: "", role: "user" });
    router.refresh();
  }

  const totals = hotels.reduce((acc, hotel) => {
    acc.rooms += hotel.totalRooms;
    acc.allocated += hotel.allocatedRooms;
    acc.available += hotel.availableRooms;
    return acc;
  }, { rooms: 0, allocated: 0, available: 0 });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6">
      <section className="grid gap-4 md:grid-cols-4">
        {[{ label: "Hotels", value: hotels.length }, { label: "Total rooms", value: totals.rooms }, { label: "Allocated", value: totals.allocated }, { label: "Available", value: totals.available }].map((item) => (
          <div className="panel p-5" key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-ink">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr_1fr]">
        <div className="panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Hotel inventory</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Portfolio overview</h2>
            </div>
            <Link className="rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700" href="/book">Open booking flow</Link>
          </div>
          <div className="mt-5 grid gap-4">
            {hotels.length === 0 ? (
              <div className="panel-muted p-6 text-sm text-slate-600">Create your first hotel to begin allocating rooms.</div>
            ) : hotels.map((hotel) => (
              <Link className="rounded-3xl border border-brand-100 bg-white p-5 transition hover:border-brand-300 hover:shadow-panel" href={`/hotels/${hotel._id}`} key={hotel._id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{hotel.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{hotel.location}</p>
                    {hotel.description ? <p className="mt-3 max-w-xl text-sm text-slate-500">{hotel.description}</p> : null}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-2xl bg-mist px-3 py-3"><p className="text-slate-500">Rooms</p><p className="mt-1 font-semibold text-ink">{hotel.totalRooms}</p></div>
                    <div className="rounded-2xl bg-red-50 px-3 py-3"><p className="text-slate-500">Occupied</p><p className="mt-1 font-semibold text-red-700">{hotel.allocatedRooms}</p></div>
                    <div className="rounded-2xl bg-emerald-50 px-3 py-3"><p className="text-slate-500">Open</p><p className="mt-1 font-semibold text-emerald-700">{hotel.availableRooms}</p></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {isAdmin && (
          <form className="panel space-y-4 p-5" onSubmit={createHotel}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Admin action</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Add hotel</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Hotel name</label>
              <Input value={hotelForm.name} onChange={(event) => setHotelForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location</label>
              <Input value={hotelForm.location} onChange={(event) => setHotelForm((current) => ({ ...current, location: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea value={hotelForm.description} onChange={(event) => setHotelForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <Button className="w-full" disabled={hotelLoading} type="submit">{hotelLoading ? "Saving..." : "Create hotel"}</Button>
          </form>
        )}

        {isAdmin && (
          <form className="panel space-y-4 p-5" onSubmit={createUser}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Admin action</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Add user</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <Input value={userForm.username} onChange={(event) => setUserForm((current) => ({ ...current, username: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input type="password" value={userForm.password} onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Role</label>
              <Select value={userForm.role} onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            <Button className="w-full" disabled={userLoading} type="submit">{userLoading ? "Saving..." : "Create user"}</Button>
          </form>
        )}
      </section>

      {isAdmin && <UserManager users={users} />}
    </div>
  );
}