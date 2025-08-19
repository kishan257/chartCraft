"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Share2, Edit3, Maximize2 } from "lucide-react"
import { BarChartComponent } from "./bar-chart"
import { LineChartComponent } from "./line-chart"
import { PieChartComponent } from "./pie-chart"
import { ScatterChartComponent } from "./scatter-chart"
import { AreaChartComponent } from "./area-chart"
import { ExportDialog } from "../export-dialog"
import { ShareDialog } from "../share-dialog"

interface ChartRendererProps {
  chartId: string
  onEdit?: () => void
  className?: string
}

interface ChartData {
  chart: {
    id: string
    name: string
    type: string
    config: any
    insights: string
  }
  data: any[]
  dataset: {
    name: string
    columns: any[]
  }
}

const chartComponents = {
  bar: BarChartComponent,
  line: LineChartComponent,
  pie: PieChartComponent,
  scatter: ScatterChartComponent,
  area: AreaChartComponent,
  histogram: BarChartComponent, // Use bar chart for histogram
  heatmap: BarChartComponent, // Simplified to bar chart for now
}

export function ChartRenderer({ chartId, onEdit, className }: ChartRendererProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`/api/charts/${chartId}/data`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch chart data")
        }

        setChartData(result)
      } catch (error) {
        console.error("Chart fetch error:", error)
        setError(error instanceof Error ? error.message : "Failed to load chart")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [chartId])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !chartData) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-600 text-xl">!</span>
            </div>
            <div>
              <h3 className="font-semibold text-red-700">Failed to Load Chart</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ChartComponent = chartComponents[chartData.chart.type as keyof typeof chartComponents] || BarChartComponent

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-serif">{chartData.chart.name}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {chartData.chart.type}
              </Badge>
            </div>
            {chartData.chart.config.description && (
              <CardDescription>{chartData.chart.config.description}</CardDescription>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            <ExportDialog chartId={chartId}>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </ExportDialog>
            <ShareDialog chartId={chartId}>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </ShareDialog>
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-96 w-full">
          <ChartComponent data={chartData.data} config={chartData.chart.config} />
        </div>

        {chartData.chart.insights && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm mb-2">AI Insights</h4>
            <p className="text-sm text-muted-foreground">{chartData.chart.insights}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
