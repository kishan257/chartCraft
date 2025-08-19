"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BarChart3, LineChart, PieChart, TrendingUp, Loader2, Lightbulb, Brain } from "lucide-react"
import { ChartRenderer } from "./charts/chart-renderer"

interface ChartGeneratorProps {
  datasetId: string
  datasetName: string
}

interface ChartRecommendation {
  type: string
  title: string
  description: string
  reasoning: string
  confidence: number
  config: {
    xAxis?: string
    yAxis?: string
    groupBy?: string
    aggregation?: string
    colors?: string[]
  }
}

interface Insight {
  type: string
  title: string
  description: string
  confidence: number
}

interface SavedChart {
  id: string
  name: string
  chart_type: string
  config: any
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  scatter: TrendingUp,
  area: LineChart,
  histogram: BarChart3,
  heatmap: TrendingUp,
}

const chartColors = {
  bar: "bg-chart-1",
  line: "bg-chart-2",
  pie: "bg-chart-3",
  scatter: "bg-chart-4",
  area: "bg-chart-5",
  histogram: "bg-chart-1",
  heatmap: "bg-chart-2",
}

export function ChartGenerator({ datasetId, datasetName }: ChartGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<ChartRecommendation[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [savedCharts, setSavedCharts] = useState<SavedChart[]>([])
  const [error, setError] = useState<string | null>(null)

  const generateCharts = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/charts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ datasetId }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to generate charts")
      }

      setRecommendations(result.recommendations)
      setInsights(result.insights)
      setSavedCharts(result.charts || [])
    } catch (error) {
      console.error("Generation error:", error)
      setError(error instanceof Error ? error.message : "Failed to generate charts")
    } finally {
      setIsGenerating(false)
    }
  }

  // Show generated charts if we have them
  if (savedCharts.length > 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            <Sparkles className="w-4 h-4" />
            Charts Generated Successfully
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif">Your AI-Generated Charts</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are the visualizations our AI created for "{datasetName}". You can interact with them, export, or
            share.
          </p>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-serif">AI Insights</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {insight.confidence}% confident
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Generated Charts */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-serif">Generated Charts</h3>
            </div>
            <Button onClick={generateCharts} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Sparkles className="w-4 h-4" />
              Regenerate
            </Button>
          </div>

          <div className="grid gap-8">
            {savedCharts.map((chart) => (
              <ChartRenderer
                key={chart.id}
                chartId={chart.id}
                onExport={() => console.log("Export chart:", chart.id)}
                onShare={() => console.log("Share chart:", chart.id)}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => {
              setRecommendations([])
              setInsights([])
              setSavedCharts([])
              setError(null)
            }}
            variant="outline"
            className="bg-transparent"
          >
            Generate New Charts
          </Button>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0 && !isGenerating && !error) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">AI Chart Generation</CardTitle>
          <CardDescription className="text-lg">
            Let our AI analyze "{datasetName}" and recommend the perfect visualizations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateCharts} size="lg" className="gap-2">
            <Brain className="w-5 h-5" />
            Generate AI Recommendations
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Generation Loading State */}
      {isGenerating && (
        <Card className="text-center p-8">
          <CardContent className="space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <h3 className="text-xl font-semibold">AI is analyzing your data...</h3>
            <p className="text-muted-foreground">
              This may take a few moments while we identify patterns and recommend the best visualizations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Generation Failed</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <Button onClick={generateCharts} variant="outline" className="mt-4 bg-transparent" size="sm">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chart Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold font-serif">Recommended Charts</h3>
            </div>
            <Button onClick={generateCharts} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Sparkles className="w-4 h-4" />
              Regenerate
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((chart, index) => {
              const Icon = chartIcons[chart.type as keyof typeof chartIcons] || BarChart3
              const colorClass = chartColors[chart.type as keyof typeof chartColors] || chartColors.bar

              return (
                <Card key={index} className="group hover:shadow-lg transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {chart.confidence}% match
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{chart.title}</CardTitle>
                    <CardDescription>{chart.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <h4 className="font-medium mb-2">Why this chart?</h4>
                      <p className="text-muted-foreground">{chart.reasoning}</p>
                    </div>

                    {chart.config.xAxis && (
                      <div className="text-sm">
                        <span className="font-medium">Configuration: </span>
                        <span className="text-muted-foreground">
                          {chart.config.xAxis} vs {chart.config.yAxis}
                          {chart.config.groupBy && ` grouped by ${chart.config.groupBy}`}
                          {chart.config.aggregation && ` (${chart.config.aggregation})`}
                        </span>
                      </div>
                    )}

                    <Button className="w-full gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Create This Chart
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
