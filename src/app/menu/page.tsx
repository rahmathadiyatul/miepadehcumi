"use client"

import dynamicImport from "next/dynamic"
export const dynamic = "force-dynamic"

const MenuClient = dynamicImport(() => import("./MenuClient"), {
    ssr: false,
    loading: () => <div>Loading menu…</div>,
})

export default function Page() {
    return <MenuClient />
}