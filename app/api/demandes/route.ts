import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TypeDocument } from "@/lib/types";

const VALID_TYPES: TypeDocument[] = ["acte_naissance", "cni", "passeport", "certificat_nationalite"];
const VALID_SEXE = ["masculin", "feminin"];
const VALID_LIEN = ["moi_meme", "parent", "tuteur_legal"];

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

function sanitize(s: unknown): string {
  return typeof s === "string" ? s.trim().slice(0, 200) : "";
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const type_document = body.type_document as TypeDocument;
  const nom = sanitize(body.nom);
  const prenom = sanitize(body.prenom);
  const date_naissance = sanitize(body.date_naissance);
  const sexe = sanitize(body.sexe);
  const commune = sanitize(body.commune);
  const nom_pere = sanitize(body.nom_pere);
  const nom_mere = sanitize(body.nom_mere);
  const telephone = sanitize(body.telephone).replace(/[^0-9+\s]/g, "").slice(0, 20);
  const lien_beneficiaire = sanitize(body.lien_beneficiaire) || "moi_meme";
  const motif = typeof body.motif === "string" ? body.motif.trim().slice(0, 500) : "";

  // Validations
  if (!VALID_TYPES.includes(type_document))
    return NextResponse.json({ error: "Type de document invalide" }, { status: 400 });
  if (nom.length < 2)
    return NextResponse.json({ error: "Le nom doit contenir au moins 2 caractères" }, { status: 400 });
  if (prenom.length < 2)
    return NextResponse.json({ error: "Le prénom doit contenir au moins 2 caractères" }, { status: 400 });
  if (!date_naissance || !/^\d{4}-\d{2}-\d{2}$/.test(date_naissance))
    return NextResponse.json({ error: "Date de naissance invalide" }, { status: 400 });

  const dob = new Date(date_naissance);
  if (isNaN(dob.getTime()) || dob >= new Date())
    return NextResponse.json({ error: "Date de naissance invalide ou dans le futur" }, { status: 400 });

  if (!VALID_SEXE.includes(sexe))
    return NextResponse.json({ error: "Sexe invalide" }, { status: 400 });
  if (!commune)
    return NextResponse.json({ error: "La commune est requise" }, { status: 400 });
  if (!VALID_LIEN.includes(lien_beneficiaire))
    return NextResponse.json({ error: "Lien bénéficiaire invalide" }, { status: 400 });

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
      nom_pere: nom_pere || null,
      nom_mere: nom_mere || null,
      telephone: telephone || null,
      lien_beneficiaire,
      motif: motif || null,
      hash_sha256,
      id_blockchain,
    })
    .select("id, reference, statut")
    .single();

  if (error) return NextResponse.json({ error: "Erreur lors de la création de la demande" }, { status: 500 });

  // Certification immédiate côté serveur (évite la perte si l'onglet est fermé)
  const bloc_number = Math.floor(1_000_000 + Math.random() * 9_000_000);
  const hash_document = await sha256(`${data.id}${bloc_number}${Date.now()}`);
  await supabase.from("demandes").update({ statut: "certifie" }).eq("id", data.id);
  await supabase.from("documents_certifies").insert({
    demande_id: data.id,
    user_id: user.id,
    bloc_number,
    hash: hash_document,
    hash_document,
    url_pdf: null,
    pdf_url: null,
  });

  // Génération du PDF certifié
  const origin = req.headers.get("x-forwarded-host")
    ? `https://${req.headers.get("x-forwarded-host")}`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  console.log(`[demandes] Appel generate-document pour demande: ${data.id}`);
  const genRes = await fetch(`${origin}/api/generate-document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": process.env.INTERNAL_SECRET ?? "",
    },
    body: JSON.stringify({ demandeId: data.id, nom, prenom, typeDocument: type_document }),
  });
  const genBody = await genRes.text();
  console.log(`[demandes] Réponse generate-document: ${genRes.status} ${genBody}`);

  // Récupérer la demande complète avec url_pdf
  const { data: demande } = await supabase
    .from("demandes")
    .select("*, documents_certifies(url_pdf, pdf_url)")
    .eq("id", data.id)
    .single();

  const url_pdf = demande?.documents_certifies?.[0]?.url_pdf ?? null;

  return NextResponse.json({ id: data.id, reference: data.reference, statut: "certifie", url_pdf });
}

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data, error } = await supabase
    .from("demandes")
    .select("*, documents_certifies(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  return NextResponse.json(data);
}
