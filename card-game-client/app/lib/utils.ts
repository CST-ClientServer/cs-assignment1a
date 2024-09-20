import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultImageUrl =
    "http://ec2-54-176-67-195.us-west-1.compute.amazonaws.com:8080/uploadFiles/6e993dd5-c1b1-40c5-8d47-a7b768a5996a_defaultImage.png"
