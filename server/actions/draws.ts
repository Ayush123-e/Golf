"use server";
import { createClient } from "../lib/supabase";

export async function simulateMonthlyDraw(drawId: string) {
  const supabase = await createClient();

  const { data: draw } = await supabase.from('draws').select('*').eq('id', drawId).single();
  if (!draw) return { error: "Draw not found." };

  const { data: entries } = await supabase
    .from('user_draw_entries')
    .select('user_id, scores')
    .eq('draw_id', drawId);

  if (!entries) return [];

  const results = entries.map(entry => {
    const entryScores = entry.scores || [];
    const drawNumbers = draw.draw_numbers || [];
    const matchCount = entryScores.filter((num: number) => drawNumbers.includes(num)).length;
    return { user_id: entry.user_id, match_count: matchCount };
  });

  const winners = results.filter(r => r.match_count >= 3);
  return winners;
}
