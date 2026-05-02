import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { reference } = await req.json();

  const normalizedRef = typeof reference === "string" ? reference.trim().toUpperCase() : "";
  if (!normalizedRef || normalizedRef.length > 30 || !/^GN-\d{4}-\d{4}-[A-F0-9]{4}$/.test(normalizedRef)) {
    return NextResponse.json({ resultat: "invalide" }, { status: 400 });
  }

  // Service role pour bypasser RLS sur une lecture publique contrôlée
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;

  const { data: demande, error } = await supabase
    .from("demandes")
    .select(`
      id, reference, type_document, statut, nom, prenom, created_at,
      documents_certifies ( hash, bloc_number, created_at )
    `)
    .eq("reference", normalizedRef)
    .eq("statut", "certifie")
    .single();

  if (error) console.error("[verifier] query error:", error.message);

  const resultat = demande ? "authentique" : "invalide";

  await supabase.from("verifications").insert({
    reference_document: normalizedRef,
    ip_verificateur: ip,
    resultat,
  });

  if (!demande) {
    return NextResponse.json({ resultat: "invalide" });
  }

  const doc = Array.isArray(demande.documents_certifies)
    ? demande.documents_certifies[0]
    : demande.documents_certifies;

  return NextResponse.json({
    resultat: "authentique",
    citoyen: `${demande.prenom ?? ""} ${demande.nom ?? ""}`.trim(),
    type_document: demande.type_document,
    date: doc?.created_at ?? demande.created_at,
    hash: doc?.hash ?? null,
    bloc_number: doc?.bloc_number ?? null,
  });
}
