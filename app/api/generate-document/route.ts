import { createHash, randomBytes, randomInt } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

export const runtime = "nodejs";

type DocumentRequest = {
  demandeId?: string;
  requestId?: string;
  id?: string;
  nom?: string;
  prenom?: string;
  fullName?: string;
  typeDocument?: string;
  type_document?: string;
  type?: string;
  citoyen?: {
    nom?: string;
    prenom?: string;
    fullName?: string;
  };
  [key: string]: unknown;
};

type SupabaseUpdate = Record<string, string>;
type DynamicDatabase = {
  public: {
    Tables: Record<
      string,
      {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
        Relationships: [];
      }
    >;
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
type SupabaseAdminClient = SupabaseClient<DynamicDatabase>;

const DEFAULT_BUCKET = "documents-certifies";
const DEFAULT_TABLE = "demandes";
const DEFAULT_STATUS_COLUMN = "statut";
const CERTIFIED_STATUS = "CERTIFIÉ";

function getSupabaseAdmin(): SupabaseAdminClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
    );
  }

  return createClient<DynamicDatabase>(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const objectValue = value as Record<string, unknown>;
  return `{${Object.keys(objectValue)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(objectValue[key])}`)
    .join(",")}}`;
}

function buildReference() {
  const digits = randomInt(0, 10_000).toString().padStart(4, "0");
  const hex = randomBytes(2).toString("hex").toUpperCase();
  return `GN-2026-${digits}-${hex}`;
}

function getCitizenName(payload: DocumentRequest) {
  const nestedName = payload.citoyen?.fullName;
  const flatName = payload.fullName;
  const nestedParts = [payload.citoyen?.prenom, payload.citoyen?.nom]
    .filter(Boolean)
    .join(" ");
  const flatParts = [payload.prenom, payload.nom].filter(Boolean).join(" ");

  return nestedName || flatName || nestedParts || flatParts || "Citoyen";
}

function getDocumentType(payload: DocumentRequest) {
  return (
    payload.typeDocument ||
    payload.type_document ||
    payload.type ||
    "Document administratif"
  );
}

function getDemandeId(payload: DocumentRequest) {
  return payload.demandeId || payload.requestId || payload.id;
}

async function createCertifiedPdf(params: {
  citizenName: string;
  documentType: string;
  reference: string;
  hash: string;
  timestamp: string;
  verificationUrl: string;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const qrDataUrl = await QRCode.toDataURL(params.verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 220,
  });
  const qrImage = await pdfDoc.embedPng(qrDataUrl);

  const green = rgb(0, 0.58, 0.38);
  const yellow = rgb(0.99, 0.82, 0.09);
  const red = rgb(0.81, 0.04, 0.13);
  const dark = rgb(0.06, 0.08, 0.11);
  const muted = rgb(0.35, 0.38, 0.42);

  page.drawRectangle({ x: 0, y: 810, width: 198.4, height: 31.89, color: red });
  page.drawRectangle({
    x: 198.4,
    y: 810,
    width: 198.4,
    height: 31.89,
    color: yellow,
  });
  page.drawRectangle({
    x: 396.8,
    y: 810,
    width: 198.48,
    height: 31.89,
    color: green,
  });

  page.drawText("IdentiGuinee", {
    x: 60,
    y: 748,
    size: 28,
    font: boldFont,
    color: dark,
  });
  page.drawText("Document certifie", {
    x: 60,
    y: 718,
    size: 15,
    font,
    color: green,
  });

  page.drawRectangle({
    x: 60,
    y: 130,
    width: 475,
    height: 545,
    borderColor: rgb(0.86, 0.88, 0.9),
    borderWidth: 1,
  });

  const rows = [
    ["Nom du citoyen", params.citizenName],
    ["Type de document", params.documentType],
    ["Reference", params.reference],
    ["Hash SHA-256", params.hash],
    ["Timestamp", params.timestamp],
  ];

  let y = 620;
  for (const [label, value] of rows) {
    page.drawText(label, {
      x: 95,
      y,
      size: 11,
      font: boldFont,
      color: muted,
    });
    page.drawText(value, {
      x: 95,
      y: y - 22,
      size: label === "Hash SHA-256" ? 9 : 13,
      font,
      color: dark,
      maxWidth: 405,
    });
    y -= label === "Hash SHA-256" ? 72 : 58;
  }

  page.drawImage(qrImage, {
    x: 375,
    y: 238,
    width: 118,
    height: 118,
  });
  page.drawText("Verifier l'authenticite", {
    x: 360,
    y: 218,
    size: 10,
    font: boldFont,
    color: green,
  });
  page.drawText(params.verificationUrl, {
    x: 95,
    y: 165,
    size: 9,
    font,
    color: muted,
    maxWidth: 405,
  });

  page.drawText("Ce document est certifie par IdentiGuinee.", {
    x: 60,
    y: 82,
    size: 10,
    font,
    color: muted,
  });

  return pdfDoc.save();
}

async function updateDemande(params: {
  supabase: SupabaseAdminClient;
  demandeId: string;
  hash: string;
  publicUrl: string;
  verificationUrl: string;
}) {
  const { error } = await params.supabase
    .from("documents_certifies")
    .update({
      pdf_url: params.publicUrl,
      url_pdf: params.publicUrl,
      qr_code_url: params.verificationUrl,
      hash_document: params.hash,
    })
    .eq("demande_id", params.demandeId);

  if (error) {
    console.error(`[generate-document] updateDemande error:`, error);
    throw error;
  }
  console.log(`[generate-document] documents_certifies mis à jour pour demande: ${params.demandeId}`);
}

export async function POST(request: Request) {
  try {
    // Auth guard — accept internal secret (server-to-server) or valid Bearer token
    const internalSecret = process.env.INTERNAL_SECRET;
    const xInternal = request.headers.get("X-Internal-Secret");
    const isInternal = internalSecret && xInternal === internalSecret;

    if (!isInternal) {
      const authHeader = request.headers.get("Authorization");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (!token) return Response.json({ error: "Non autorisé" }, { status: 401 });

      const { createClient: createServerClient } = await import("@/lib/supabase/server");
      const supabaseAuth = await createServerClient();
      const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
      if (authError || !user) return Response.json({ error: "Non autorisé" }, { status: 401 });
    }

    const payload = (await request.json()) as DocumentRequest;
    const demandeId = getDemandeId(payload);

    if (!demandeId) {
      return Response.json(
        { error: "demandeId, requestId or id is required" },
        { status: 400 }
      );
    }

    const reference = buildReference();
    const timestamp = new Date().toISOString();
    const citizenName = getCitizenName(payload);
    const documentType = getDocumentType(payload);
    const hash = createHash("sha256")
      .update(stableStringify({ payload, reference, timestamp }))
      .digest("hex");
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin ||
      "http://localhost:3000";
    const verificationUrl = `${origin}/verifier?ref=${encodeURIComponent(
      reference
    )}`;

    const pdfBytes = await createCertifiedPdf({
      citizenName,
      documentType,
      reference,
      hash,
      timestamp,
      verificationUrl,
    });

    const supabase = getSupabaseAdmin();
    const bucket = process.env.SUPABASE_DOCUMENTS_BUCKET || DEFAULT_BUCKET;
    const storagePath = `${reference}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error(`[generate-document] Upload error:`, uploadError);
      throw uploadError;
    }
    console.log(`[generate-document] PDF uploadé: ${storagePath}`);

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);
    const publicUrl = publicUrlData.publicUrl;

    await updateDemande({ supabase, demandeId, hash, publicUrl, verificationUrl });

    return Response.json({
      reference,
      hash,
      timestamp,
      verificationUrl,
      pdf: {
        bucket,
        path: storagePath,
        publicUrl,
      },
      status: CERTIFIED_STATUS,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Document generation failed";

    return Response.json({ error: message }, { status: 500 });
  }
}
