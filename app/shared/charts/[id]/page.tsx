import { createServerClient } from "@/lib/supabase/server"
import { ChartRenderer } from "@/components/charts/chart-renderer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface SharedChartPageProps {
  params: { id: string }
}

export default async function SharedChartPage({ params }: SharedChartPageProps) {
  const supabase = createServerClient()

  const { data: chart, error } = await supabase.from("charts").select("*, datasets(*)").eq("id", params.id).single()

  if (error || !chart) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-serif">ChartCraft</h1>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ExternalLink className="w-4 h-4" />
              Create Your Own
            </Button>
          </Link>
        </div>
      </header>

      {/* Chart */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Chart Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{chart.name}</CardTitle>
              <CardDescription>
                {chart.config.description || "Interactive chart created with ChartCraft"}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Chart Visualization */}
          <ChartRenderer chartId={params.id} className="border-0 shadow-lg" />

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Created with ChartCraft - AI-Powered Data Visualization</p>
            <Link href="/">
              <Button className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Create Your Own Charts
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
