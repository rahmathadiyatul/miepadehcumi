'use client'

import { useEffect, useState } from "react"
import type { MenuCategory, MenuData } from "@/database/page"

export default function useMenuData(isEditor = false) {
    const [menuCategory, setMenuCategory] = useState<MenuCategory[]>([])
    const [menuTrigger, setMenuTrigger] = useState(false)

    useEffect(() => {
        const load = async () => {
            let cats: MenuCategory[] = []

            const stored = localStorage.getItem("menuCategory")
            if (stored) {
                try {
                    const parsed: MenuCategory[] = JSON.parse(stored)
                    if (parsed.length) {
                        cats = parsed
                    }
                } catch {
                    console.warn("Invalid JSON in localStorage, refetching…")
                }
            }

            if (!cats.length) {
                try {
                    const res = await fetch("/admin/data/menu.json")
                    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
                    const data: MenuData = await res.json()
                    cats = data.navMain
                } catch (err) {
                    console.error("useMenuData:", err)
                }
            }

            if (!isEditor) {
                cats = cats
                    .map(cat => ({
                        ...cat,
                        items: cat.items.filter(item => item.is_active),
                    }))
                    .filter(cat => cat.items.length > 0)
            }

            setMenuCategory(cats)
        }

        load()
    }, [menuTrigger, isEditor])

    return { menuCategory, setMenuTrigger, menuTrigger }
}
