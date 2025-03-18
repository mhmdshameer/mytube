"use client";

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { History, ListVideo, ThumbsUp } from "lucide-react";
import Link from "next/link";

const items =[
    {
        title: 'History',
        icon: History,
        url: '/playlists/history',
        auth: true,
    },
    {
        title: 'Liked videos',
        icon: ThumbsUp,
        url: '/playlists/liked',
        auth: true,
    },
    {
        title: 'All playlists',
        icon: ListVideo,
        url: '/playlists',
        auth: true,
    }
]

export const PersonalSection = () => {
    const {isSignedIn} = useAuth();
    const clerk = useClerk();
    return (
     <SidebarGroup>
        <SidebarGroupLabel>You</SidebarGroupLabel>
        <SidebarGroupContent>
            <SidebarMenu>
                {items.map((item)=> (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          asChild
                          isActive={false}
                          onClick={(e) => {
                            if(!isSignedIn && item.auth){
                                e.preventDefault();
                                return clerk.openSignIn();
                            }
                          }}
                        >
                            <Link href={item.url} className="flex items-center gap-4">
                            <item.icon/>
                            <span className="text-sm">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroupContent>
     </SidebarGroup>
    )
}