import { Handler } from "@netlify/functions"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

const handler: Handler = async () => {
    try {
        const { data, error } = await supabase
            .from("menu")
            .select("id, title, price, description, is_active, url, category_id, category:category_id (id, title)")
            .eq("is_active", true)

        if (error) {
            console.error("Supabase query error:", error)
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.message }),
            }
        }

        // Group menu items by category
        const grouped = new Map<number, {
            title: string
            url: string
            items: any[]
        }>()

        for (const item of data || []) {
            const category = Array.isArray(item.category) ? item.category[0] : item.category
            const categoryId = category?.id
            const categoryTitle = category?.title || "Uncategorized"

            if (!grouped.has(categoryId)) {
                grouped.set(categoryId, {
                    title: categoryTitle,
                    url: "#",
                    items: [],
                })
            }

            grouped.get(categoryId)!.items.push({
                menuId: item.id,
                title: item.title,
                price: item.price,
                description: item.description?.replace(/::[a-z ]+$/, ""),
                is_active: item.is_active,
                url: item.url,
                category_id: categoryId,
            })
        }

        const navMain = Array.from(grouped.values())

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ navMain }),
        }
    } catch (err: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        }
    }
}

export { handler }
