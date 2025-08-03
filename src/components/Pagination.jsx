import React from "react";

export default function Pagination({
  currentPage,
  cursors,
  hasNextPage,
  onPageChange,
  onNext,
}) {
  const totalPages = hasNextPage ? cursors.length + 1 : cursors.length;

  return (
    <div className="flex items-center justify-center flex-wrap gap-2">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 rounded-md border text-sm ${i === currentPage
            ? "bg-black text-white border-black"
            : "bg-white text-black hover:bg-gray-100 border-gray-300"
            }`}
        >
          {i + 1}
        </button>
      ))}

      {hasNextPage && (
        <button
          onClick={onNext}
          className="px-4 py-2 rounded-md border text-sm bg-white text-black hover:bg-gray-100 border-gray-300"
        >
          Next
        </button>
      )}
    </div>
  );
}
