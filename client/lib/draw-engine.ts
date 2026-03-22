import { createServiceRoleClient } from "./supabase";
import { sendWinNotification } from "./mail";

export async function generateDraw(drawMonth: string, drawType: 'random' | 'algorithm' = 'random') {
  const supabase = createServiceRoleClient();
  
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
      jackpotCarry = Number(lastDraw.total_pool) * 0.40;
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
      draw_type: drawType,
      total_pool: totalPool,
      jackpot_carry: jackpotCarry,
      is_published: false
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { success: true, draw };
}

export async function processWinners(drawId: string) {
  const supabase = createServiceRoleClient();
  
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

  if (entries && entries.length > 0) {
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
      const { data: insertedWinners } = await supabase.from('winners').insert(winners).select('*, profiles(email)');
      
      if (insertedWinners) {
        for (const winner of insertedWinners) {
          if ((winner as any).profiles?.email) {
             await sendWinNotification((winner as any).profiles.email, winner.prize_amount);
          }
        }
      }
    }
    return { success: true, winnerCount: winners.length };
  }
  return { success: true, winnerCount: 0 };
}

export async function publishResults(drawId: string) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('draws')
    .update({ is_published: true, processed_at: new Date().toISOString() })
    .eq('id', drawId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function executeDraw(drawMonth: string) {
  const genRes = await generateDraw(drawMonth);
  if (genRes.error || !genRes.draw) return { error: genRes.error };

  const procRes = await processWinners(genRes.draw.id);
  if (procRes.error) return { error: procRes.error };

  const pubRes = await publishResults(genRes.draw.id);
  if (pubRes.error) return { error: pubRes.error };

  return { success: true, drawId: genRes.draw.id };
}

function calculateTotalTierPrize(matches: number, draw: any) {
  if (matches === 5) return Number(draw.total_pool) * 0.40;
  if (matches === 4) return Number(draw.total_pool) * 0.35;
  if (matches === 3) return Number(draw.total_pool) * 0.25;
  return 0;
}
