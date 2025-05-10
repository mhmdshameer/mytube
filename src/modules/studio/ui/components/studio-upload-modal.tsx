"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video created successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <>
    <ResponsiveModal
    title="Upload Video"
    open = {!!create.data}
    onOpenChange={()=>create.reset()}
    >
     <p>This will be an uploader</p>
    </ResponsiveModal>
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
      >
      {create.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Plus />
      )}
      Create
    </Button>
   </>
  );
};
