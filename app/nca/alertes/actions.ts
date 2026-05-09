"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resoudreAlerte(alerteId: string) {
  const supabase = await createClient();
  await supabase.from("alertes").update({ niveau: "resolu", resolved_at: new Date().toISOString() }).eq("id", alerteId);
  revalidatePath("/nca/alertes");
}
