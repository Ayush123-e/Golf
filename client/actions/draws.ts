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

import { createServiceRoleClient } from "../lib/supabase";
import { generateDraw, processWinners, publishResults, executeDraw } from "../lib/draw-engine";

export async function adminGenerateDrawNumbers(drawMonth: string, drawType: 'random' | 'algorithm' = 'random') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const res = await generateDraw(drawMonth, drawType);
  if (res.error) return { error: res.error };
  
  revalidatePath('/draws');
  revalidatePath('/admin/draws');
  return { success: true, draw: (res as any).draw };
}

export async function adminProcessWinners(drawId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const res = await processWinners(drawId);
  if (res.error) return { error: res.error };

  revalidatePath('/admin/draws');
  return { success: true, winnerCount: (res as any).winnerCount };
}

export async function adminPublishDraw(drawId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const res = await publishResults(drawId);
  if (res.error) return { error: res.error };

  revalidatePath('/draws');
  revalidatePath('/dashboard');
  revalidatePath('/admin/draws');
  return { success: true };
}
export async function uploadWinnerProof(winnerId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get('file') as File;
  if (!file) return { error: "No file provided" };

  const { data: winner } = await supabase
    .from('winners')
    .select('*')
    .eq('id', winnerId)
    .single();

  if (!winner || winner.user_id !== user.id) {
    return { error: "Authorization failed" };
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `${winnerId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('score_proofs')
    .upload(filePath, file);

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from('score_proofs')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('winners')
    .update({ 
      proof_url: publicUrl,
      status: 'pending' 
    })
    .eq('id', winnerId);

  if (updateError) return { error: updateError.message };

  revalidatePath('/dashboard');
  revalidatePath('/draws');
  return { success: true };
}

export async function adminVerifyWinner(winnerId: string, status: 'approved' | 'rejected') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };
  
  const { error } = await supabase
    .from('winners')
    .update({ 
      status, 
      verified_at: status === 'approved' ? new Date().toISOString() : null 
    })
    .eq('id', winnerId);

  if (error) return { error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/draws');
  return { success: true };
}

import { sendWinNotification, sendPaymentNotification } from "../lib/mail";

export async function adminMarkPaid(winnerId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  if (profile?.role !== 'admin') return { error: "Permission denied" };

  const { data: winner } = await supabase.from('winners').select('*, profiles(email)').eq('id', winnerId).single();

  const { error } = await supabase
    .from('winners')
    .update({ status: 'paid' })
    .eq('id', winnerId);

  if (error) return { error: error.message };

  if (winner && (winner as any).profiles?.email) {
    await sendPaymentNotification((winner as any).profiles.email, winner.prize_amount);
  }

  revalidatePath('/dashboard');
  revalidatePath('/admin/winners');
  return { success: true };
}
