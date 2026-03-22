"use client";

import Skeleton from "../ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-black p-6 md:p-12 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-48 rounded-[2.5rem]" />
          <Skeleton className="h-48 rounded-[2.5rem]" />
          <Skeleton className="h-48 rounded-[2.5rem]" />
          <Skeleton className="h-48 rounded-[2.5rem]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] rounded-[3.5rem]" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[280px] rounded-[3rem]" />
            <Skeleton className="h-[280px] rounded-[3rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
