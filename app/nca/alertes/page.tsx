import { createClient } from "@/lib/supabase/server";
import { AlertesClient } from "./AlertesClient";

export default async function AlertesPage() {
  const supabase = await createClient();
  const { data: alertes } = await supabase.from("alertes").select("*").order("created_at", { ascending: false });

  const critiques = (alertes ?? []).filter((a) => a.niveau === "critique").length;
  const avertissements = (alertes ?? []).filter((a) => a.niveau === "attention").length;

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-white text-xl font-bold">Alertes système</h1>
      <AlertesClient alertes={(alertes ?? []) as any} critiques={critiques} avertissements={avertissements} />
    </div>
  );
}
