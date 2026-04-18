import { createClient } from "@/lib/supabase";
import { Settings as SettingsIcon } from "lucide-react";
import SettingsClient from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <SettingsIcon size={24} className="text-zinc-500" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">System<br />Config</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium italic max-w-md">
            Manage your account preferences and session.
          </p>
        </div>

        <SettingsClient />
      </div>
    </div>
  );
}
