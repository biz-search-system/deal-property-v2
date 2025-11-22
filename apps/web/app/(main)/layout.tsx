import { AppSidebar } from "@/components/nav/app-sidebar";
import { SiteHeader } from "@/components/nav/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          // "--sidebar-width": "calc(var(--spacing) * 72)", // 18rem = 288px
          // "--sidebar-width": "calc(var(--spacing) * 60)", // 15rem = 240px
          "--sidebar-width": "calc(var(--spacing) * 58)", // 14.5rem = 232px
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
