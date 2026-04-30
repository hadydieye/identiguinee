import { cn } from "@/lib/utils";

type Status = "EN_COURS" | "CERTIFIE" | "REJETE";

const config: Record<Status, { label: string; className: string }> = {
  EN_COURS:  { label: "EN COURS",  className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  CERTIFIE:  { label: "CERTIFIÉ",  className: "bg-[#009460]/20 text-[#009460] border-[#009460]/30" },
  REJETE:    { label: "REJETÉ",    className: "bg-[#CE1126]/20 text-[#CE1126] border-[#CE1126]/30" },
};

export function StatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>
      {label}
    </span>
  );
}
