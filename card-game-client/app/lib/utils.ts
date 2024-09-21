import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const defaultImageUrl =
    "http://ec2-54-176-67-195.us-west-1.compute.amazonaws.com:8080/uploadFiles/c188b16a-0ce7-404c-8b2e-34129c8b9931_defaultImage.png";

export const fileUploadUrl =
    "http://ec2-54-176-67-195.us-west-1.compute.amazonaws.com:8080/uploadFiles/"

export const imageFileExtensions = ["apng", "png", "avif", "gif", "jpg", "jpeg",
    "jfif", "pjpeg", "pjp", "svg", "webp"
];
export const videoFileExtensions = ["mp4", "webm", "m4p", "m4v"];
export const audioFileExtensions = ["mp3", "ogg", "wav", "m4a", "m4b", "m4p", "oga", "mogg", ];
