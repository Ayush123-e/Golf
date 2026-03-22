import { createClient } from "@/lib/supabase";
import ProfileClient from "@/components/profile/ProfileClient";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [
    { data: profile },
    { data: subscription },
    { data: userCharity }
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('subscriptions').select('*').eq('user_id', user.id).eq('status', 'active').single(),
    supabase.from('user_charities').select('*, charities(*)').eq('user_id', user.id).single()
  ]);

  return (
    <div className="min-h-screen bg-transparent text-white p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <User size={24} className="text-zinc-500" />
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Player<br />Passport</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium italic max-w-md">
            Your elite identity within the GOLF HERO ecosystem. Manage your status and track your global impact.
          </p>
        </div>

        <ProfileClient 
          profile={profile} 
          subscription={subscription} 
          charity={userCharity?.charities} 
        />
      </div>
    </div>
  );
}
