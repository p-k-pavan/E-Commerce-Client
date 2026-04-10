export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center mt-auto">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl bg-gray-50">
          <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="mb-10 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-64 mb-3" />
      <div className="h-5 bg-gray-200 rounded w-96" />
    </div>
  );
}