import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultImageUrl =
  "https://png.pngtree.com/png-clipart/20220124/original/pngtree-cartoon-cute-yellow-question-mark-question-sticker-variety-decorative-pattern-png-image_7175415.png";
