import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-ink text-white hover:bg-brand-700",
  secondary: "bg-brand-100 text-brand-900 hover:bg-brand-200",
  ghost: "bg-white text-ink hover:bg-mist",
  danger: "bg-danger text-white hover:opacity-90",
  outline: "bg-white text-ink border-2 border-slate-200 hover:bg-slate-50"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

