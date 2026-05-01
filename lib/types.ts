export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nom: string;
          prenom: string;
          telephone: string | null;
          commune: string | null;
          id_blockchain: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      demandes: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          type_document: TypeDocument;
          statut: StatutDemande;
          nom: string | null;
          prenom: string | null;
          date_naissance: string | null;
          sexe: string | null;
          commune: string | null;
          nom_pere: string | null;
          nom_mere: string | null;
          telephone: string | null;
          lien_beneficiaire: string;
          motif: string | null;
          hash_sha256: string | null;
          id_blockchain: string | null;
          motif_rejet: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["demandes"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["demandes"]["Insert"]>;
      };
      documents_certifies: {
        Row: {
          id: string;
          demande_id: string;
          user_id: string | null;
          bloc_number: number;
          hash: string | null;
          hash_document: string | null;
          pdf_url: string | null;
          url_pdf: string | null;
          qr_code_url: string | null;
          timestamp_blockchain: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["documents_certifies"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["documents_certifies"]["Insert"]>;
      };
      justificatifs: {
        Row: {
          id: string;
          demande_id: string;
          nom_fichier: string;
          type_fichier: string;
          url_storage: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["justificatifs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["justificatifs"]["Insert"]>;
      };
    };
  };
};

export type TypeDocument = "acte_naissance" | "cni" | "passeport" | "certificat_nationalite";
export type StatutDemande = "en_cours" | "certifie" | "rejete";

export type Demande = Database["public"]["Tables"]["demandes"]["Row"];
export type DocumentCertifie = Database["public"]["Tables"]["documents_certifies"]["Row"];

export type DemandeAvecDocument = Demande & {
  documents_certifies?: DocumentCertifie[];
};

export const TYPE_DOCUMENT_LABELS: Record<TypeDocument, string> = {
  acte_naissance: "Acte de naissance",
  cni: "Carte d'identité nationale",
  passeport: "Passeport",
  certificat_nationalite: "Certificat de nationalité",
};

export const DOCUMENTS_REQUIS: Record<TypeDocument, string[]> = {
  acte_naissance: ["Extrait de naissance existant", "Pièce d'identité du parent"],
  cni: ["Acte de naissance", "Photo d'identité"],
  passeport: ["CNI", "Acte de naissance", "Photo d'identité"],
  certificat_nationalite: ["Acte de naissance", "CNI"],
};
