import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:px-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton className="h-28" key={index} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-[420px] xl:col-span-1" />
        <Skeleton className="h-[420px] xl:col-span-1" />
        <Skeleton className="h-[420px] xl:col-span-1" />
      </div>
    </div>
  );
}

