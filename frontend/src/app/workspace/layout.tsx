import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-siderbar"
import { SiteHeader } from "@/components/site-headers"



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}