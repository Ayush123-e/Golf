import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PremiumBackground from "@/components/ui/PremiumBackground";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black">
      <AdminSidebar />
      <main className="flex-1 relative overflow-y-auto">
        <PremiumBackground />
        <div className="relative z-10 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
