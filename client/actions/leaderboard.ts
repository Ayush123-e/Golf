"use server";
import { createClient } from "../lib/supabase";

export async function getLeaderboard() {
  const supabase = await createClient();

  // Fetch profiles ordered by rolling_avg descending
  // We only include users who have at least one score (rolling_avg > 0) or all for now
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, rolling_avg')
    .gt('rolling_avg', 0)
    .order('rolling_avg', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Leaderboard fetch error:", error);
    return { error: error.message, profiles: [] };
  }
  
  return { profiles: profiles || [] };
}
