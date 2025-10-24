import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          // "--sidebar-width": "calc(var(--spacing) * 72)",　// 18rem = 288px
          "--header-height": "calc(var(--spacing) * 12)", // 3rem = 48px
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="">
        <SiteHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
