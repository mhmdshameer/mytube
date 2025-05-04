import { SidebarHeader } from "@/components/ui/sidebar"
import { UserAvatar } from "@/components/user-avatar"
import { useUser } from "@clerk/nextjs";
import Link from "next/link"

export const StudiosidebarHeader = () =>{
    const {user} = useUser();

    if (!user) return null;
    return(
        <SidebarHeader className="flex items-center justify-between pb-4">
           <Link href="/users/current">
           <UserAvatar 
            imageUrl={user.imageUrl}
            name={user?.fullName ?? "User"}
            className="size-[112px] hover:opacity-80 transition-opacity"
           />
           </Link>
        </SidebarHeader>
    )
}