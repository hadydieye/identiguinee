"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransition } from "react";

export function DemandesFilters({ statut, type, search }: { statut?: string; type?: string; search?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  function update(key: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all") params.set(key, value); else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Input
        defaultValue={search}
        placeholder="Rechercher référence ou nom…"
        className="w-64 bg-[#1A1A2E] border-[#2a2a4a] text-white placeholder:text-[#6b7280] text-sm"
        onChange={(e) => {
          clearTimeout((window as any)._st);
          (window as any)._st = setTimeout(() => update("search", e.target.value), 400);
        }}
      />
      <Select defaultValue={statut ?? "all"} onValueChange={(v) => update("statut", v)}>
        <SelectTrigger className="w-40 bg-[#1A1A2E] border-[#2a2a4a] text-white text-sm">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A2E] border-[#2a2a4a] text-white">
          <SelectItem value="all">Tous statuts</SelectItem>
          <SelectItem value="en_cours">En cours</SelectItem>
          <SelectItem value="certifie">Certifié</SelectItem>
          <SelectItem value="rejete">Rejeté</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={type ?? "all"} onValueChange={(v) => update("type", v)}>
        <SelectTrigger className="w-48 bg-[#1A1A2E] border-[#2a2a4a] text-white text-sm">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A2E] border-[#2a2a4a] text-white">
          <SelectItem value="all">Tous types</SelectItem>
          <SelectItem value="acte_naissance">Acte de naissance</SelectItem>
          <SelectItem value="cni">CNI</SelectItem>
          <SelectItem value="passeport">Passeport</SelectItem>
          <SelectItem value="certificat_nationalite">Cert. nationalité</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
