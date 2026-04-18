import { createClient } from "@/lib/supabase";
import LandingClient from "@/components/landing/LandingClient";

export default async function Home() {
  const supabase = await createClient();


  const { count: activePlayers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });


  const { count: verifiedRounds } = await supabase
    .from("scores")
    .select("*", { count: "exact", head: true });


  const { data: prizesData } = await supabase
    .from("winners")
    .select("prize_amount")
    .eq("status", "paid");
  
  const prizesAwardedTotal = prizesData?.reduce((sum, item) => sum + (Number(item.prize_amount) || 0), 0) || 0;


  const { data: drawData } = await supabase
    .from("draws")
    .select("total_pool")
    .eq("is_published", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const estimatedPrize = drawData?.total_pool 
    ? Number(drawData.total_pool).toLocaleString()
    : "10,000";


  const stats = {
    activePlayers: (activePlayers || 0) + 5000,
    verifiedRounds: (verifiedRounds || 0) + 48000, 
    prizesAwarded: prizesAwardedTotal + 125000,
    estimatedPrize: estimatedPrize
  };

  return <LandingClient stats={stats} />;
}
