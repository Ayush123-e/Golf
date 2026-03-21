"use server";
import { createClient } from "../lib/supabase";

export async function getDrawStatus() {
  const supabase = await createClient();
  
  const { data: draw } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'active')
    .single();

  return { draw };
}
