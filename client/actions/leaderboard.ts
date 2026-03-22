"use server";
import { createClient } from "../lib/supabase";

export async function getLeaderboard() {
  const supabase = await createClient();

  // Diagnostic: Try a simple count first
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error("Schema Diagnostic Error:", JSON.stringify(countError, null, 2));
  }

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, rolling_avg')
    .gt('rolling_avg', 0)
    .order('rolling_avg', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Leaderboard fetch error:", JSON.stringify(error, null, 2));
    return { error: error.message || "Unknown database error", profiles: [] };
  }
  
  return { profiles: profiles || [] };
}
