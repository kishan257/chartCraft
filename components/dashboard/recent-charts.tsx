"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BarChart3, LineChart, PieChart, MoreHorizontal, Eye, Share2, X } from "lucide-react"
import Link from "next/link"
import { ChartRenderer } from "@/components/charts/chart-renderer"

interface Chart {
  id: string
  name: string
  type: string
  datasetName: string
  createdAt: string
  views: number
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  scatter: BarChart3,
  area: LineChart,
}

const chartColors = {
  bar: "bg-chart-1",
  line: "bg-chart-2",
  pie: "bg-chart-3",
  scatter: "bg-chart-4",
  area: "bg-chart-5",
}

export function RecentCharts() {
  const [charts, setCharts] = useState<Chart[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState<Chart | null>(null)
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await fetch("/api/charts?limit=4")
        if (response.ok) {
          const data = await response.json()
          setCharts(data.charts || [])
        } else {
          // Fallback to mock data if API fails
          setCharts([
            {
              id: "1",
              name: "Sales by Region",
              type: "bar",
              datasetName: "Sales Q4 2024",
              createdAt: "2024-01-15",
              views: 24,
            },
            {
              id: "2",
              name: "Revenue Trend",
              type: "line",
              datasetName: "Sales Q4 2024",
              createdAt: "2024-01-14",
              views: 18,
            },
            {
              id: "3",
              name: "Satisfaction Distribution",
              type: "pie",
              datasetName: "Customer Survey",
              createdAt: "2024-01-12",
              views: 31,
            },
            {
              id: "4",
              name: "Traffic Over Time",
              type: "area",
              datasetName: "Website Analytics",
              createdAt: "2024-01-10",
              views: 42,
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch charts:", error)
        // Use mock data as fallback
        setCharts([
          {
            id: "1",
            name: "Sales by Region",
            type: "bar",
            datasetName: "Sales Q4 2024",
            createdAt: "2024-01-15",
            views: 24,
          },
          {
            id: "2",
            name: "Revenue Trend",
            type: "line",
            datasetName: "Sales Q4 2024",
            createdAt: "2024-01-14",
            views: 18,
          },
          {
            id: "3",
            name: "Satisfaction Distribution",
            type: "pie",
            datasetName: "Customer Survey",
            createdAt: "2024-01-12",
            views: 31,
          },
          {
            id: "4",
            name: "Traffic Over Time",
            type: "area",
            datasetName: "Website Analytics",
            createdAt: "2024-01-10",
            views: 42,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCharts()
  }, [])

  const handleViewChart = (chart: Chart) => {
    setSelectedChart(chart)
    setIsChartModalOpen(true)
  }

  const handleShareChart = async (chartId: string) => {
    try {
      const response = await fetch(`/api/charts/${chartId}/share`, {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        await navigator.clipboard.writeText(data.shareUrl)
        alert("Share link copied to clipboard!")
      }
    } catch (error) {
      console.error("Failed to share chart:", error)
      alert("Failed to generate share link")
    }
  }

  const handleMoreOptions = (chartId: string) => {
    // Could open a dropdown menu or modal with more options
    console.log("More options for chart:", chartId)
  }

  const handleCloseChart = () => {
    setIsChartModalOpen(false)
    setSelectedChart(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-serif">Recent Charts</CardTitle>
            <CardDescription>Your latest visualizations</CardDescription>
          </div>
          <Link href="/dashboard/charts">
            <Button variant="outline" size="sm" className="bg-transparent">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {charts.map((chart) => {
                const Icon = chartIcons[chart.type as keyof typeof chartIcons] || BarChart3
                const colorClass = chartColors[chart.type as keyof typeof chartColors] || chartColors.bar

                return (
                  <div
                    key={chart.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{chart.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">From {chart.datasetName}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {chart.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{chart.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewChart(chart)} title="View Chart">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShareChart(chart.id)} title="Share Chart">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoreOptions(chart.id)}
                        title="More Options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isChartModalOpen} onOpenChange={setIsChartModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedChart?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleCloseChart}>
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedChart && (
            <div className="mt-4">
              <ChartRenderer chartId={selectedChart.id} chartType={selectedChart.type} chartName={selectedChart.name} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
