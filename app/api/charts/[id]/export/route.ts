import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { format, options } = await request.json()
    const supabase = createServerClient()

    // Get chart data
    const { data: chart, error } = await supabase.from("charts").select("*, datasets(*)").eq("id", params.id).single()

    if (error || !chart) {
      return NextResponse.json({ error: "Chart not found" }, { status: 404 })
    }

    // For this demo, we'll return a mock export URL
    // In a real implementation, you would:
    // 1. Generate the chart image using a headless browser (Puppeteer)
    // 2. Save to cloud storage (Vercel Blob, S3, etc.)
    // 3. Return the download URL

    const exportData = {
      chartId: params.id,
      format,
      options,
      downloadUrl: `/api/charts/${params.id}/download?format=${format}`,
      filename: `${chart.name.replace(/[^a-zA-Z0-9]/g, "_")}.${format}`,
    }

    return NextResponse.json({
      success: true,
      export: exportData,
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export chart" }, { status: 500 })
  }
}
