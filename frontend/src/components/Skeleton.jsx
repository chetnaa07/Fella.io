export default function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton rounded ${className}`} />
      ))}
    </>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 skeleton" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-16 bg-gray-200 skeleton rounded" />
        <div className="h-3 w-full bg-gray-200 skeleton rounded" />
        <div className="h-3 w-20 bg-gray-200 skeleton rounded" />
      </div>
    </div>
  );
}
