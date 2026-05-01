import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function sha256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { demande_id } = await req.json() as { demande_id: string };

  const { data: demande, error: fetchErr } = await supabase
    .from("demandes")
    .select("id, user_id")
    .eq("id", demande_id)
    .eq("user_id", user.id)
    .single();

  if (fetchErr || !demande) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });

  const { error: updateErr } = await supabase
    .from("demandes")
    .update({ statut: "certifie" })
    .eq("id", demande_id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  const bloc_number = Math.floor(1_000_000 + Math.random() * 9_000_000);
  const hash_document = await sha256(`${demande_id}${bloc_number}${Date.now()}`);

  const { data: doc, error: docErr } = await supabase
    .from("documents_certifies")
    .insert({
      demande_id,
      user_id: user.id,
      bloc_number,
      hash: hash_document,
      hash_document,
      url_pdf: null,
      pdf_url: null,
    })
    .select()
    .single();

  if (docErr) return NextResponse.json({ error: docErr.message }, { status: 500 });
  return NextResponse.json(doc);
}
