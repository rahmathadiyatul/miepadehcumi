'use client'

import { useEffect, useState } from "react"
import type { MenuCategory, MenuData } from "@/database/page"

export default function useMenuData() {
    const [menuCategory, setMenuCategory] = useState<MenuCategory[]>([])
    const [menuTrigger, setMenuTrigger] = useState<boolean>(false)

    useEffect(() => {
        const load = async () => {
            const stored = localStorage.getItem("menuCategory")
            if (stored && JSON.parse(stored).length > 0) {
                try {
                    setMenuCategory(JSON.parse(stored))
                    return
                } catch {
                    console.warn("Invalid JSON in localStorage, refetching…")
                }
            }

            try {
                const res = await fetch("/admin/data/menu.json")
                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
                const data: MenuData = await res.json()
                setMenuCategory(data.navMain)
            } catch (err) {
                console.error("useMenuData:", err)
            }
        }

        load()
    }, [menuTrigger])

    return { menuCategory, setMenuTrigger, menuTrigger }
}
