"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginValues = {
  username: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm<LoginValues>();

  async function onSubmit(values: LoginValues) {
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error ?? "Login failed");
      setLoading(false);
      return;
    }

    toast.success(`Welcome back, ${data.user.username}`);
    router.push(data.user.role === "admin" ? "/admin" : "/book");
    router.refresh();
  }

  return (
    <form className="panel w-full max-w-md space-y-4 px-6 py-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Username</label>
        <Input placeholder="Enter username" {...register("username")} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <Input type={showPassword ? "text" : "password"} placeholder="Enter password" {...register("password")} />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-brand-700 hover:text-brand-900"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <Button className="w-full" disabled={loading} type="submit">{loading ? "Signing in..." : "Login"}</Button>
    </form>
  );
}

