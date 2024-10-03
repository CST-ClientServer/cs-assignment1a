import React from "react";
import Image from "next/image";
import {
    cn,
    defaultImageUrl,
    videoFileExtensions,
    audioFileExtensions,
} from "@/app/lib/utils";

interface MediaDisplayProps {
    src: string;
    editing: boolean;
    mediaUrl: string;
    setMediaUrl: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({
    src,
    editing,
    mediaUrl,
    setMediaUrl,
    className,
}) => {
    const getFileExtension = (url: string) => {
        return url.substring(url.lastIndexOf(".") + 1).toLowerCase();
    };

    const actualSrc = editing ? mediaUrl : src;

    if (videoFileExtensions.includes(getFileExtension(actualSrc))) {
        return (
            <video
                src={actualSrc}
                controls={true}
                autoPlay={true}
                width={200}
                height={200}
                className={cn(["rounded-lg", "md:w-2/5", "mb-6", className])}
                onError={() => setMediaUrl(defaultImageUrl)}
            />
        );
    } else if (audioFileExtensions.includes(getFileExtension(actualSrc))) {
        return (
            <audio
                src={actualSrc}
                autoPlay={true}
                controls={true}
                onError={() => setMediaUrl(defaultImageUrl)}
            />
        );
    } else {
        return (
            <Image
                src={actualSrc}
                width={200}
                height={200}
                alt={"Quiz card image"}
                className={cn([
                    "rounded-md",
                    mediaUrl === defaultImageUrl,
                    "mb-6",
                    className,
                ])}
                onError={() => setMediaUrl(defaultImageUrl)}
            />
        );
    }
};

export default MediaDisplay;
