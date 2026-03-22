"use server";

import { createClient } from "../lib/supabase";
import { revalidatePath } from "next/cache";

export async function getCharities() {
  const supabase = await createClient();
  const { data: charities, error } = await supabase
    .from('charities')
    .select('*')
    .order('name');
  
  if (error) return { error: error.message, charities: [] };
  return { charities };
}

export async function getCharityById(id: string) {
  const supabase = await createClient();
  const { data: charity, error } = await supabase
    .from('charities')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return { error: error.message };
  return { charity };
}

export async function updateUserCharity(charityId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from('user_charities')
    .upsert({ 
      user_id: user.id, 
      charity_id: charityId,
      percentage: 10 
    }, { onConflict: 'user_id' });

  if (error) return { error: error.message };
  
  revalidatePath('/dashboard');
  revalidatePath('/charities');
  return { success: true };
}

export async function getUserCharity() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: selection, error } = await supabase
    .from('user_charities')
    .select('*, charity:charities(*)')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') return { error: error.message };
  return { selection };
}

export async function deleteCharity(charityId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: "Admin access required" };

  const { error } = await supabase.from('charities').delete().eq('id', charityId);
  if (error) return { error: error.message };

  revalidatePath('/admin/charities');
  revalidatePath('/charities');
  return { success: true };
}

export async function addCharity(charity: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: "Admin access required" };

  const { error } = await supabase.from('charities').insert(charity);
  if (error) return { error: error.message };

  revalidatePath('/admin/charities');
  revalidatePath('/charities');
  return { success: true };
}
