import Image from "next/image";

interface VideoThumbnailProps {
    imageUrl?: string | null;
}

export const VideoThumbnail = ({imageUrl}: VideoThumbnailProps) => {
  return (
    <div className="relative">
      {/* Thumbnail Wrapper */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden">
        <Image src={imageUrl || "/placeholder.svg"} alt="Thumbnail" fill className="size-full object-cover"/>
      </div>
    </div>
  );
};
