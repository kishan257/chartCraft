import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { data: dataset, error } = await supabase.from("datasets").select("*").eq("id", params.id).single()

    if (error || !dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    return NextResponse.json({ dataset })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
