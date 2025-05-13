import Image from "next/image";

export const VideoThumbnail = () => {
  return (
    <div className="relative">
      {/* Thumbnail Wrapper */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden">
        <Image src="/placeholder.svg" alt="Thumbnail" fill className="size-full object-cover"/>
      </div>
    </div>
  );
};
