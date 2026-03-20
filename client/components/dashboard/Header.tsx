"use client";

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="p-6 pt-10 flex justify-between items-end">
      <div>
        <h2 className="text-zinc-400 text-sm font-medium">Welcome back,</h2>
        <h1 className="text-2xl font-bold italic tracking-tight uppercase">
          {user?.full_name || 'Golfer'}
        </h1>
      </div>
      <div className="text-right">
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Elite Tier
          </span>
        </div>
      </div>
    </header>
  );
}
