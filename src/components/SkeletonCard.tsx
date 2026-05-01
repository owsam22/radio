export default function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
      {/* Title skeleton */}
      <div className="shimmer h-5 w-3/4 rounded-lg" />
      {/* Tags skeleton */}
      <div className="flex gap-2">
        <div className="shimmer h-4 w-16 rounded-md" />
        <div className="shimmer h-4 w-12 rounded-md" />
      </div>
      {/* Details skeleton */}
      <div className="space-y-2">
        <div className="shimmer h-3 w-1/2 rounded-md" />
        <div className="shimmer h-3 w-2/3 rounded-md" />
      </div>
      {/* Bottom row */}
      <div className="flex items-center justify-between pt-2">
        <div className="shimmer h-4 w-20 rounded-md" />
        <div className="shimmer h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
