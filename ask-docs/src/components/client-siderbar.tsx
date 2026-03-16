"use client";

import { useTitle } from "@/context/TitleDocuments";
// 👇 Asegúrate de importar aquí tus componentes de UI (Sidebar, Tooltip, etc.)
import { Calendar, Home, Inbox, InboxIcon, Search, Settings, Files, ChevronUp, User2, CircleArrowUpIcon, File } from "lucide-react"
import { UploadButton } from "@/components/new-document-button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,

    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Separator } from "@radix-ui/react-separator"
// Menu items.
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Define la estructura de tu item
interface ChatItem {
    id: string;
    title: string;
}
// const items = [
//   {
//     title: "Reporte-1",
//     url: "#",
//     icon: File,
//   },
//   {
//     title: "Reporte-2",
//     url: "#",
//     icon: File,
//   },
//   {
//     title: "Reporte-3",
//     url: "/workspace/chat/cc3b9b8a-c32c-45e2-bae2-7a219f0e4d1e",
//     icon: File,
//   },
//   {
//     title: "Reporte-4",
//     url: "/workspace/chat/8de61e52-d5e8-415d-825b-fb0ae9d860f8",
//     icon: File,
//   },
//   {
//     title: "Reporte-5",
//     url: "#",
//     icon: File,
//   },

// ]



export function ClientSidebarItem({ item }: { item: ChatItem }) {

    const { setTitle } = useTitle();


    return (


        <SidebarMenu>
            <SidebarMenuItem key={item.id} className="p-2">
                <SidebarMenuButton asChild>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href={`/workspace/chat/${item.id}`}
                                className="flex items-center gap-2"
                                onClick={() => setTitle(item.title)}>
                                <span>{item.title}</span>
                            </Link>
                        </TooltipTrigger>


                        <TooltipContent>
                            {item.title}
                        </TooltipContent>
                    </Tooltip>

                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>

    )
}