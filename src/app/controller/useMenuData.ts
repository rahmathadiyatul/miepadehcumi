'use client'

import { useEffect, useState } from "react"
import type { MenuCategory, MenuCard } from "@/database/page"

export default function useMenuData(isEditor = false) {
    const [menuCategory, setMenuCategory] = useState<MenuCategory[]>([])
    const [menuTrigger, setMenuTrigger] = useState(false)

    useEffect(() => {
        const load = async () => {
            let cats: MenuCategory[] = []

            // Attempt to load from localStorage
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

            // If no cached data, fetch from Netlify Function
            if (!cats.length) {
                try {
                    const res = await fetch("https://miepadehcumi.netlify.app/.netlify/functions/getMenu")
                    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
                    console.log("Fetching menu data from Netlify Function", res)
                    const items: MenuCard[] = await res.json()

                    // Group items by category_id
                    const map = new Map<number, MenuCategory>()

                    for (const item of items) {
                        const cat = map.get(item.category_id) || {
                            id: item.category_id,
                            name: `Category ${item.category_id}`, // You may want to fetch real category names
                            items: [],
                        }
                        // cat.items.push(item)
                        // map.set(item.category_id, cat)
                    }

                    cats = Array.from(map.values())
                    localStorage.setItem("menuCategory", JSON.stringify(cats))
                } catch (err) {
                    console.error("useMenuData:", err)
                }
            }

            // Filter inactive items if not in editor mode
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
