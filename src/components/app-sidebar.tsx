'use client'

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { menuData } from "@/database/page"
import Image from "next/image"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({})
  const { setSelectedMenuName, open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar()
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const handleClickSub = (menuName: string) => {
    if (isMobile) {
      setOpen(!open)
      setOpenMobile(!openMobile)
    } else {
      setOpen(!open)
    }
    setSelectedMenuName(menuName)
  }

  return (
    <Sidebar {...props} className="text-[#fae89f]">
      <SidebarHeader className="bg-[#b82828]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-[#b82828] hover:text-[#fae89f]" size="lg" asChild>
              <a href="#">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  priority
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-bold text-[#fae89f]">Mie Padeh Cumi</span>
                  <span className="texl-2xs text-[#fae89f]">Batu Gadang - Solok</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-[#b82828]">
        <SidebarGroup>
          <SidebarMenu>
            {menuData.navMain.map((item) => {
              const hasChildren = item.items?.length
              const isOpen = openMenus[item.title]
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="hover:bg-[#991f1f] hover:text-[#fae89f]"
                    onClick={() => hasChildren ? toggleMenu(item.title) : undefined}
                    asChild={!hasChildren}
                  >
                    <a
                      href={hasChildren ? "#" : item.url}
                      className="font-medium text-[#fae89f] flex justify-between w-full"
                    >
                      <span>{item.title}</span>
                      {hasChildren && (
                        <span className="text-xs">
                          {isOpen ? "▾" : "▸"}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>

                  {hasChildren && isOpen && (
                    <SidebarMenuSub className="border-l-0">
                      {item.items.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title} onClick={() => handleClickSub(subitem.title)}>
                          <SidebarMenuSubButton
                            className="bg-[#b82828] hover:bg-[#991f1f]"
                            asChild
                            isActive={subitem.isActive}
                          >
                            <a
                              href={subitem.url}
                              style={{ color: "#fae89f" }}
                            >
                              {subitem.title}
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
