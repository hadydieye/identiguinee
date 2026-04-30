import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NavbarPublic } from "@/components/landing/navbar-public";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { FlowSteps } from "@/components/landing/flow-steps";
import { NaissanceChain } from "@/components/landing/naissancechain";
import { Cta } from "@/components/landing/cta";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="bg-[#06090F] min-h-screen">
      <NavbarPublic />
      <Hero />
      <Stats />
      <FlowSteps />
      <NaissanceChain />
      <Cta />
    </div>
  );
}
