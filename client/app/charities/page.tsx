import { getCharities, getUserCharity } from "@/actions/charities";
import CharityDirectory from "@/components/charities/CharityDirectory";
import DashboardHeader from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase";

export default async function CharitiesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  const { charities } = await getCharities();
  const { selection } = await getUserCharity();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <DashboardHeader user={profile} />
      
      <div className="pt-20">
        <CharityDirectory 
          charities={charities} 
          initialSelection={selection} 
        />
      </div>
    </div>
  );
}
