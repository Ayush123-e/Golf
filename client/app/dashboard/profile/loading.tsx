import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { User } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-12 relative overflow-hidden">
      
      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <User size={24} className="text-zinc-500" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-zinc-900 rounded-lg animate-pulse" />
              <div className="h-8 w-32 bg-zinc-900 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="h-12 w-96 bg-zinc-900 rounded-lg animate-pulse mt-4" />
        </div>

        <ProfileSkeleton />
      </div>
    </div>
  );
}
