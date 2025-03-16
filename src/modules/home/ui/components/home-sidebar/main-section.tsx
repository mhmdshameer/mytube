"use client";

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Flame, Home, PlaySquare } from "lucide-react";
import Link from "next/link";

const items =[
    {
        title: 'Home',
        icon: Home,
        url: '/'
    },
    {
        title: 'Subscriptions',
        icon: PlaySquare,
        url: '/feed/subscriptions',
        auth: true,
    },
    {
        title: 'Trending',
        icon: Flame,
        url: '/feed/trending',
    }
]

export const MainSection = () => {
    return (
     <SidebarGroup>
        <SidebarGroupContent>
            <SidebarMenu>
                {items.map((item)=> (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          asChild
                          isActive={false}
                          onClick={() => {}}
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