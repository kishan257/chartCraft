import { createServerClient } from "@/lib/supabase/server"
import { ChartRenderer } from "@/components/charts/chart-renderer"
import { notFound } from "next/navigation"

interface EmbedChartPageProps {
  params: { id: string }
}

export default async function EmbedChartPage({ params }: EmbedChartPageProps) {
  const supabase = createServerClient()

  const { data: chart, error } = await supabase.from("charts").select("*, datasets(*)").eq("id", params.id).single()

  if (error || !chart) {
    notFound()
  }

  return (
    <div className="w-full h-screen bg-background p-4">
      <ChartRenderer chartId={params.id} className="h-full border-0" />
    </div>
  )
}
