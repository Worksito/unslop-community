import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Le helper standard de shadcn, attendu par les composants 21st.dev.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
