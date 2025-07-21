'use client'

import { MenuCategory, MenuData } from "@/database/page"
import { useEffect, useState } from "react"

export default function useMenuData() {
    const [menuData, setMenuData] = useState<MenuData | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/admin/data/menu.json")
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
                const data: MenuData = await res.json()
                setMenuData(data)
            } catch (err) {
                console.error("useMenuData:", err)
            }
        }
        load()
    }, [])

    const menuCategory: MenuCategory[] = menuData?.navMain ?? []

    return { menuCategory }
}
