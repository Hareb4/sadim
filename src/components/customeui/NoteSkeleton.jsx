// components/NoteSkeleton.jsx
export default function NoteSkeleton() {
  return (
    <div className="animate-pulse" dir="rtl">
      <div className="h-64 bg-gray-200 dark:bg-gray-700 mb-4"></div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 mb-4 w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 mb-2 w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 mb-2 w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 mb-2 w-1/3"></div>
    </div>
  );
}
