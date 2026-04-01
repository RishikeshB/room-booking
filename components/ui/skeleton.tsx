export function Skeleton({ className = "h-24 w-full" }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-brand-100/80 ${className}`} />;
}

