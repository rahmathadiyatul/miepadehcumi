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
            .select("id, title, price, description, is_active, url, category_id")
            .eq("is_active", true)

        if (error) {
            console.error("Supabase query error:", error)
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.message }),
            }
        }

        const mappedData = data?.map((item) => ({
            menuId: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
            is_active: item.is_active,
            url: item.url,
            category_id: item.category_id,
        }))

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify(mappedData),
        }
    } catch (err: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        }
    }
}

export { handler }
