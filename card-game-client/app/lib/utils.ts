import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const defaultImageUrl =
    process.env.NEXT_PUBLIC_IS_DEV === "true"
        ? "https://png.pngtree.com/png-clipart/20220124/original/pngtree-cartoon-cute-yellow-question-mark-question-sticker-variety-decorative-pattern-png-image_7175415.png"
        : "https://jasper-server-meh.shop/uploadFiles/c188b16a-0ce7-404c-8b2e-34129c8b9931_defaultImage.png";

export const fileUploadUrl =
    process.env.NEXT_PUBLIC_IS_DEV === "true"
        ? "http://localhost:8081/uploadFiles/"
        : "https://jasper-server-meh.shop/uploadFiles/";

export const imageFileExtensions = [
    "apng",
    "png",
    "avif",
    "gif",
    "jpg",
    "jpeg",
    "jfif",
    "pjpeg",
    "pjp",
    "svg",
    "webp",
];
export const videoFileExtensions = ["mp4", "webm", "m4p", "m4v"];
export const audioFileExtensions = [
    "mp3",
    "ogg",
    "wav",
    "m4a",
    "m4b",
    "m4p",
    "oga",
    "mogg",
];
