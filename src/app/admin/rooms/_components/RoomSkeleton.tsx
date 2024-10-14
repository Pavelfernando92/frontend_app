import { Skeleton } from "@/components/ui/skeleton";
export function RoomSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full bg-white/20" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full bg-white/20" />
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-4 bg-white/20" />
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {[...Array(100)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-white/20 rounded-full" />
          ))}
        </div>
      </div>
    </>
  );
}
