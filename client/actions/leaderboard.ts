"use server";
import { createClient } from "../lib/supabase";

export async function getLeaderboard() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, rolling_avg')
    .order('rolling_avg', { ascending: false })
    .limit(50);

  if (error) return { error: error.message };
  return { profiles };
}
