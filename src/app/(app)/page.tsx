import { createClient } from "@/features/core/lib/supabase/server";
import { DashboardContent } from "@/features/projects/components/dashboard-content";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single();

  return <DashboardContent initialProfile={profile || { name: 'Dev' }} />;
}
