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
import { chatRepo } from "@/lib/repositories/instances"
import { ClientSidebarItem } from "@/components/client-siderbar"
import { NewChatButton } from "@/components/ui/newchatButton"

export const dynamic = "force-dynamic";
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



export async function AppSidebar() {

  const data = await chatRepo.getAllDocs();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row p-2 space-x-2">
          <Files />
          <h1 className="font-medium">Ask-Docs</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <NewChatButton />
              {data.map((item) => (
                <ClientSidebarItem key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}