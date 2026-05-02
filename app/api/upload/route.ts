import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_SIZE = 5 * 1024 * 1024;

// Magic bytes → MIME (images uniquement, cohérent avec le front)
const MAGIC: [Uint8Array, string][] = [
  [new Uint8Array([0xff, 0xd8, 0xff]), "image/jpeg"],             // JPEG
  [new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png"],        // PNG
  [new Uint8Array([0x52, 0x49, 0x46, 0x46]), "image/webp"],       // WEBP (RIFF....)
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
    return NextResponse.json({ error: "Type de fichier non autorisé (JPG, PNG, WEBP uniquement)" }, { status: 400 });

  const ext = mime === "image/jpeg" ? "jpg" : mime === "image/png" ? "png" : "webp";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("justificatifs")
    .upload(path, buffer, { contentType: mime, upsert: false });

  if (error) {
    console.error("[upload] Supabase Storage error:", error.message, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ path: data.path });
}
