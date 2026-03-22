"use server";

import { createClient } from "../lib/supabase";

export async function getAdminStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { data: totalPrize } = await supabase.from('winners').select('prize_amount').eq('status', 'paid');
  const { data: charityImpact } = await supabase.from('charity_ledger').select('amount');

  const totalPrizePaid = totalPrize?.reduce((acc, curr) => acc + Number(curr.prize_amount), 0) || 0;
  const totalCharityRaised = charityImpact?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  return {
    stats: {
      totalUsers: totalUsers || 0,
      activeSubscribers: activeSubs || 0,
      totalPrizePaid,
      totalCharityRaised
    }
  };
}

export async function getAllUsers() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*, subscriptions(*)')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { users };
}

export async function updateUserRole(userId: string, role: 'subscriber' | 'admin') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getDrawSimulation(drawId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const { data: draw } = await supabase.from('draws').select('*').eq('id', drawId).single();
  const { data: entries } = await supabase.from('user_draw_entries').select('*').eq('draw_id', drawId);

  if (!draw || !entries) return { error: "Data missing" };

  const simulation = entries.map(entry => {
    const matchCount = entry.scores.filter((num: number) => draw.draw_numbers.includes(num)).length;
    return matchCount;
  });

  const winners = {
    5: simulation.filter(m => m === 5).length,
    4: simulation.filter(m => m === 4).length,
    3: simulation.filter(m => m === 3).length,
  };

  const payouts = {
    5: winners[5] > 0 ? (draw.total_pool * 0.40) / winners[5] : 0,
    4: winners[4] > 0 ? (draw.total_pool * 0.35) / winners[4] : 0,
    3: winners[3] > 0 ? (draw.total_pool * 0.25) / winners[3] : 0,
  };

  return { simulation: { winners, payouts, totalPool: draw.total_pool } };
}

export async function addCharity(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const image_url = formData.get('image_url') as string;

  const { error } = await supabase
    .from('charities')
    .insert({ name, description, image_url });

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCharity(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const { error } = await supabase
    .from('charities')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}
