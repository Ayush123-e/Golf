"use server";

import { createClient } from "../lib/supabase";
import { revalidatePath } from "next/cache";

export async function getDrawStatus() {
  const supabase = await createClient();
  
  const { data: currentDraw } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { currentDraw };
}

export async function getUserEntry(drawId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: "Not authenticated" };

  const { data: entry } = await supabase
    .from('user_draw_entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('draw_id', drawId)
    .single();

  const { data: winner } = await supabase
    .from('winners')
    .select('*')
    .eq('user_id', user.id)
    .eq('draw_id', drawId)
    .single();

  return { entry, winner };
}

export async function adminGenerateDrawNumbers(drawMonth: string) {
  const supabase = await createClient();
  
  const { count: activeSubs } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { data: lastDraw } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let jackpotCarry = 0;
  if (lastDraw && lastDraw.is_published) {
    const { count: fiveMatchWinners } = await supabase
      .from('winners')
      .select('*', { count: 'exact', head: true })
      .eq('draw_id', lastDraw.id)
      .eq('match_count', 5);

    if (fiveMatchWinners === 0) {
      jackpotCarry = lastDraw.total_pool * 0.40;
    }
  }

  const basePool = (activeSubs || 0) * 10;
  const totalPool = basePool + jackpotCarry;

  const numbers = new Set<number>();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  const drawNumbers = Array.from(numbers).sort((a, b) => a - b);

  const { data: draw, error } = await supabase
    .from('draws')
    .insert({
      draw_month: drawMonth,
      draw_numbers: drawNumbers,
      draw_type: 'random',
      total_pool: totalPool,
      jackpot_carry: jackpotCarry,
      is_published: false
    })
    .select()
    .single();

  if (error) return { error: error.message };
  
  revalidatePath('/draws');
  return { success: true, draw };
}

export async function adminProcessWinners(drawId: string) {
  const supabase = await createClient();
  
  const { data: draw } = await supabase
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single();
    
  if (!draw) return { error: "Draw not found" };

  const { data: entries } = await supabase
    .from('user_draw_entries')
    .select('*')
    .eq('draw_id', drawId);

  if (!entries) return { error: "No entries found" };

  const entriesWithMatches = entries.map(entry => ({
    ...entry,
    match_count: entry.scores.filter((num: number) => draw.draw_numbers.includes(num)).length
  }));

  const counts = {
    5: entriesWithMatches.filter(e => e.match_count === 5).length,
    4: entriesWithMatches.filter(e => e.match_count === 4).length,
    3: entriesWithMatches.filter(e => e.match_count === 3).length,
  };

  const winners = entriesWithMatches
    .filter(e => e.match_count >= 3)
    .map(e => {
      const tierCount = counts[e.match_count as keyof typeof counts];
      const totalTierPrize = calculateTotalTierPrize(e.match_count, draw);
      const splitPrize = totalTierPrize / tierCount;

      return {
        user_id: e.user_id,
        draw_id: drawId,
        match_count: e.match_count,
        status: 'pending',
        prize_amount: splitPrize
      };
    });

  if (winners.length > 0) {
    const { error: winnerError } = await supabase
      .from('winners')
      .insert(winners);
      
    if (winnerError) return { error: winnerError.message };
  }

  return { success: true, winnerCount: winners.length };
}

function calculateTotalTierPrize(matches: number, draw: any) {
  if (matches === 5) return draw.total_pool * 0.40;
  if (matches === 4) return draw.total_pool * 0.35;
  if (matches === 3) return draw.total_pool * 0.25;
  return 0;
}

export async function adminPublishDraw(drawId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('draws')
    .update({ is_published: true, processed_at: new Date().toISOString() })
    .eq('id', drawId);

  if (error) return { error: error.message };
  
  revalidatePath('/draws');
  revalidatePath('/dashboard');
  return { success: true };
}
