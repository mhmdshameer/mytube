import Image from "next/image";

interface VideoThumbnailProps {
  title: string;
  imageUrl?: string | null;
  previewUrl?: string | null;
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      {/* Thumbnail Wrapper */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Thumbnail"
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl || imageUrl || "/placeholder.svg"}
          alt="Thumbnail"
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
    </div>
  );
};
