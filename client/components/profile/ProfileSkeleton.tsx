"use client";

import Skeleton from "../ui/Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col items-center">
        <Skeleton className="w-48 h-48 rounded-[3rem]" />
        <Skeleton className="h-6 w-32 rounded-2xl mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-40 rounded-[2.5rem]" />
        <Skeleton className="h-40 rounded-[2.5rem]" />
        <Skeleton className="h-40 rounded-[2.5rem]" />
      </div>

      <div className="p-12 bg-zinc-950 border border-white/5 rounded-[4rem]">
        <div className="max-w-sm mx-auto space-y-8">
          <div className="space-y-2 text-center">
            <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-64 mx-auto rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
