import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserCircle, MapPin, Phone, Hash } from "lucide-react";

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: totalDemandes } = await supabase
    .from("demandes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: certifiees } = await supabase
    .from("demandes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("statut", "certifie");

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-white">Mon profil</h1>

      {/* Carte identité */}
      <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#009460]/20 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-[#009460]" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">
              {profile?.prenom} {profile?.nom}
            </p>
            <p className="text-white/50 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {profile?.id_blockchain && (
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
              <Hash className="w-4 h-4 text-[#FCD116] flex-shrink-0" />
              <div>
                <p className="text-white/40 text-xs">ID Blockchain</p>
                <p className="text-[#FCD116] font-mono text-sm">{profile.id_blockchain}</p>
              </div>
            </div>
          )}
          {profile?.commune && (
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
              <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
              <div>
                <p className="text-white/40 text-xs">Commune</p>
                <p className="text-white text-sm">{profile.commune}</p>
              </div>
            </div>
          )}
          {profile?.telephone && (
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
              <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
              <div>
                <p className="text-white/40 text-xs">Téléphone</p>
                <p className="text-white text-sm">{profile.telephone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-white">{totalDemandes ?? 0}</p>
          <p className="text-white/50 text-sm mt-1">Demandes totales</p>
        </div>
        <div className="bg-[#0D1117] border border-[#009460]/30 rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-[#009460]">{certifiees ?? 0}</p>
          <p className="text-white/50 text-sm mt-1">Documents certifiés</p>
        </div>
      </div>

      {/* Compte */}
      <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-6 space-y-2">
        <p className="text-white font-semibold text-sm">Informations du compte</p>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Email</span>
          <span className="text-white">{user.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Membre depuis</span>
          <span className="text-white">
            {new Date(user.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
          </span>
        </div>
      </div>
    </div>
  );
}
