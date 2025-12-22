export default function FeedSkeleton() {
  return Array.from({ length: 10 }, (_, i) => (
    <div
      key={`feed-${i}`}
      className="w-full mx-auto border-b border-gray-200 rounded-lg bg-white mb-4"
    >
      <div className="flex items-center py-5 px-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="ml-3 space-y-2">
          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="aspect-square bg-gray-200 animate-shimmer" />

      <div className="p-4 space-y-3">
        <div className="space-y-4 pt-2">
          <div className="w-[50%] h-3 bg-gray-100 rounded animate-pulse" />
          <div className="w-[20%] h-3 bg-gray-100 rounded animate-pulse" />
          <div className="flex items-center gap-x-2">
            <div className="w-[30%] h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-[30%] h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-[80%] h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
          <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  ));
}
