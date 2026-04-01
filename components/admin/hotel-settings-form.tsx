"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function HotelSettingsForm({ hotel }: { hotel: { _id: string; name: string; location: string; description?: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: hotel.name,
    location: hotel.location,
    description: hotel.description ?? ""
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`/api/hotels/${hotel._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to update hotel");
      return;
    }

    toast.success("Hotel updated");
    router.refresh();
  }

  return (
    <form className="panel space-y-4 p-5" onSubmit={onSubmit}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">Hotel settings</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Edit property</h2>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Hotel name</label>
        <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Location</label>
        <Input value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
      </div>
      <Button className="w-full" disabled={loading} type="submit">{loading ? "Saving..." : "Save hotel"}</Button>
    </form>
  );
}