export function SidebarSkeleton() {
  return (
    <div className="flex lg:flex-col gap-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 shrink-0 px-4 py-2 w-32 lg:w-full rounded-xl bg-gray-50">
          <div className="h-8 w-8 md:h-12 md:w-12 shrink-0 rounded-lg bg-gray-200" />
          <div className="hidden lg:block h-4 bg-gray-200 rounded w-24" />
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
    return (
      <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3 md:mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-1/3" />
        </div>
      </div>
    );
  }