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
    };
  };
};
