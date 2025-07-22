// src/app/api/update-menu/route.ts
import { NextResponse } from "next/server"
import { updateMenuFile } from "@/lib/utils"
import type { MenuCategory } from "@/database/page"

export async function POST(request: Request) {
    const { navMain } = (await request.json()) as { navMain: MenuCategory[] }
    if (!Array.isArray(navMain)) {
        return NextResponse.json(
            { error: "Invalid payload" },
            { status: 400 }
        )
    }
    try {
        await updateMenuFile(navMain)
        return NextResponse.json({ ok: true })
    } catch (err: any) {
        console.error("❌ update-menu error", err)
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
