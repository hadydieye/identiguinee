import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateIdBlockchain(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `GN-2026-${n}`;
}

export function formatDistanceToNow(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (hours > 0) return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (minutes > 0) return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  return "à l'instant";
}
