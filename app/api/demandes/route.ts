import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TypeDocument } from "@/lib/types";

function generateReference(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  const hex = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, "0").toUpperCase();
  return `GN-${year}-${num}-${hex}`;
}

async function sha256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateIdBlockchain(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `GN-2026-${n}`;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const {
    type_document, nom, prenom, date_naissance, sexe, commune,
    nom_pere, nom_mere, telephone, lien_beneficiaire, motif,
  } = body as {
    type_document: TypeDocument;
    nom: string; prenom: string; date_naissance: string;
    sexe: string; commune: string; nom_pere?: string; nom_mere?: string;
    telephone?: string; lien_beneficiaire: string; motif?: string;
  };

  const reference = generateReference();
  const hash_sha256 = await sha256(`${nom}${prenom}${date_naissance}${type_document}${Date.now()}`);
  const id_blockchain = generateIdBlockchain();

  const { data, error } = await supabase
    .from("demandes")
    .insert({
      user_id: user.id,
      reference,
      type_document,
      statut: "en_cours",
      nom, prenom, date_naissance, sexe, commune,
      nom_pere: nom_pere ?? null,
      nom_mere: nom_mere ?? null,
      telephone: telephone ?? null,
      lien_beneficiaire,
      motif: motif ?? null,
      hash_sha256,
      id_blockchain,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id, reference: data.reference, statut: data.statut });
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data, error } = await supabase
    .from("demandes")
    .select("*, documents_certifies(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
