import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_SIZE = 5 * 1024 * 1024;

// Magic bytes → MIME
const MAGIC: [Uint8Array, string][] = [
  [new Uint8Array([0x25, 0x50, 0x44, 0x46]), "application/pdf"], // %PDF
  [new Uint8Array([0xff, 0xd8, 0xff]), "image/jpeg"],            // JPEG
  [new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png"],       // PNG
];

function detectMime(bytes: Uint8Array): string | null {
  for (const [sig, mime] of MAGIC) {
    if (sig.every((b, i) => bytes[i] === b)) return mime;
  }
  return null;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "Taille max : 5 MB" }, { status: 400 });

  const buffer = new Uint8Array(await file.arrayBuffer());
  const mime = detectMime(buffer);
  if (!mime)
    return NextResponse.json({ error: "Type de fichier non autorisé" }, { status: 400 });

  const ext = mime === "application/pdf" ? "pdf" : mime === "image/jpeg" ? "jpg" : "png";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("justificatifs")
    .upload(path, buffer, { contentType: mime, upsert: false });

  if (error) return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
  return NextResponse.json({ path: data.path });
}
