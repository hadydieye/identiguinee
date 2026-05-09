"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function validerDemande(demandeId: string) {
  const supabase = await createClient();
  await supabase.from("demandes").update({ statut: "certifie", updated_at: new Date().toISOString() }).eq("id", demandeId);
  await supabase.from("verifications_admin").insert({ demande_id: demandeId, type: "certification", resultat: "confirme", duree_ms: 120 });
  revalidatePath(`/nca/demandes/${demandeId}`);
  revalidatePath("/nca/demandes");
}

export async function rejeterDemande(demandeId: string, motif: string) {
  const supabase = await createClient();
  await supabase.from("demandes").update({ statut: "rejete", motif_rejet: motif, updated_at: new Date().toISOString() }).eq("id", demandeId);
  await supabase.from("verifications_admin").insert({ demande_id: demandeId, type: "rejet", resultat: "echec", duree_ms: 80 });
  revalidatePath(`/nca/demandes/${demandeId}`);
  revalidatePath("/nca/demandes");
}
