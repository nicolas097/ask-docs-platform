"use client"
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
const items = [
  {
    title: "Reporte-1",
    url: "#",
    icon: File,
  },
  {
    title: "Reporte-2",
    url: "#",
    icon: File,
  },
  {
    title: "Reporte-3",
    url: "#",
    icon: File,
  },
  {
    title: "Reporte-4",
    url: "#",
    icon: File,
  },
  {
    title: "Reporte-5",
    url: "#",
    icon: File,
  },

]

export function AppSidebar() {
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
              <Link href={"/workspace"} className="w-full">
                <Button
                
                className="w-full justify-center gap-2" variant="outline"


              >
                
                <CircleArrowUpIcon className="mr-2 h-4 w-4 text-black" />
                <span className="text-gray-950">Nuevo PDF</span>
              </Button>

              </Link>
            

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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