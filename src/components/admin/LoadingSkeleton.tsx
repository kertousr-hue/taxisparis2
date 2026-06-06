interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'table' | 'text';
  count?: number;
}

export default function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  const renderCard = () => (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="p-4 border-b animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  const renderTable = () => (
    <tr className="border-b animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 justify-end">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  const renderText = () => (
    <div className="space-y-2 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  );

  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map(i => <div key={i}>{renderCard()}</div>)}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="divide-y">
        {items.map(i => <div key={i}>{renderList()}</div>)}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <>
        {items.map(i => renderTable())}
      </>
    );
  }

  return (
    <>
      {items.map(i => <div key={i} className="mb-4">{renderText()}</div>)}
    </>
  );
}
