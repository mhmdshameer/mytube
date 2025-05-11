import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";

const Page = async () => {
    try {
        await trpc.studio.getMany.prefetchInfinite({
            limit: DEFAULT_LIMIT
        });
    } catch (error) {
        console.error("Failed to prefetch studio data:", error);
    }

    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    );
};

export default Page;