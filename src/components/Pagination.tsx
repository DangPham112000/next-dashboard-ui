"use client";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { useRouter } from "next/navigation";
import React from "react";

export default function Pagination({
  page,
  count,
}: {
  page: number;
  count: number;
}) {
  const countPage = Math.ceil(count / ITEM_PER_PAGE);

  const router = useRouter();

  const hasPrev = page > 1;
  const hasNext = page < countPage;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="flex items-center justify-between text-gray-500 p-4">
      <button
        disabled={!hasPrev}
        onClick={() => changePage(page - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          {
            length: countPage,
          },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                key={index}
                className={`px-2 rounded-md ${
                  page === pageIndex ? "bg-stSky" : ""
                }`}
                onClick={() => {
                  changePage(pageIndex);
                }}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
