"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import MenuDetails from "../menu/page"

export default function Page() {
  return (
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset>
        <header className="fixed top-0 left-0 w-full z-100 bg-[#b82828] flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger className="text-[#fae89f] hover:bg-[#991f1f] hover:text-[#fae89f]" />
            <Breadcrumb className="z-100">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold text-xl text-[#fae89f]">Silakan Pilih Menu Kamu</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <MenuDetails />
      </SidebarInset>
    </SidebarProvider>
  )
}
