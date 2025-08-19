import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { type, settings } = await request.json()
    const supabase = createServerClient()

    // Get chart data
    const { data: chart, error } = await supabase.from("charts").select("*, datasets(*)").eq("id", params.id).single()

    if (error || !chart) {
      return NextResponse.json({ error: "Chart not found" }, { status: 404 })
    }

    // Generate sharing data based on type
    const shareData: any = {
      chartId: params.id,
      type,
      settings,
    }

    switch (type) {
      case "public_link":
        shareData.url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/shared/charts/${params.id}`
        shareData.title = `${chart.name} - ChartCraft`
        shareData.description = chart.config.description || "Interactive chart created with ChartCraft"
        break

      case "embed":
        shareData.embedCode = `<iframe src="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/embed/charts/${params.id}" width="${settings.width || 800}" height="${settings.height || 600}" frameborder="0"></iframe>`
        shareData.width = settings.width || 800
        shareData.height = settings.height || 600
        break

      case "social":
        shareData.platforms = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this chart: ${chart.name}`)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/shared/charts/${params.id}`)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/shared/charts/${params.id}`)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/shared/charts/${params.id}`)}`,
        }
        break

      default:
        return NextResponse.json({ error: "Invalid share type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      share: shareData,
    })
  } catch (error) {
    console.error("Share error:", error)
    return NextResponse.json({ error: "Failed to create share link" }, { status: 500 })
  }
}
