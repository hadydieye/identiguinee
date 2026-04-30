import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { reference } = await req.json();

  if (!reference?.trim()) {
    return NextResponse.json({ resultat: "invalide" }, { status: 400 });
  }

  const supabase = await createClient();
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;

  // Cherche la demande certifiée avec cette référence
  const { data: demande } = await supabase
    .from("demandes")
    .select(`
      id, reference, type_document, statut, created_at,
      profiles ( nom, prenom ),
      documents_certifies ( hash, bloc_number, created_at )
    `)
    .eq("reference", reference.trim())
    .eq("statut", "certifie")
    .single();

  const resultat = demande ? "authentique" : "invalide";

  // Enregistre la vérification
  await supabase.from("verifications").insert({
    reference_document: reference.trim(),
    ip_verificateur: ip,
    resultat,
  });

  if (!demande) {
    return NextResponse.json({ resultat: "invalide" });
  }

  const doc = Array.isArray(demande.documents_certifies)
    ? demande.documents_certifies[0]
    : demande.documents_certifies;

  const profile = Array.isArray(demande.profiles)
    ? demande.profiles[0]
    : demande.profiles;

  return NextResponse.json({
    resultat: "authentique",
    citoyen: `${profile?.prenom ?? ""} ${profile?.nom ?? ""}`.trim(),
    type_document: demande.type_document,
    date: doc?.created_at ?? demande.created_at,
    hash: doc?.hash ?? null,
    bloc_number: doc?.bloc_number ?? null,
  });
}
