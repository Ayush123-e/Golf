"use server";

import { createClient } from "../lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateProfile(fullName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id,
      full_name: fullName, 
      updated_at: new Date().toISOString() 
    }, { onConflict: 'id' });

  if (error) {
    console.error("Profile update error:", error);
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get('file') as File;
  if (!file) return { error: "No file provided" };

  const fileExt = file.name.split('.').pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  const versionedUrl = `${publicUrl}?v=${Date.now()}`;

  const { error: updateError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, avatar_url: versionedUrl }, { onConflict: 'id' });

  if (updateError) return { error: updateError.message };

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/profile');
  return { success: true, url: versionedUrl };
}
