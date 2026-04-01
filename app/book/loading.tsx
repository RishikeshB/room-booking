import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-2 lg:px-6">
      <Skeleton className="h-[620px]" />
      <div className="space-y-6">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[380px]" />
      </div>
    </div>
  );
}

