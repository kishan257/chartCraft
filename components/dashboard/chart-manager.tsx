"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, PieChart, Search, Plus, Filter, MoreHorizontal, Eye, Share2, Trash2 } from "lucide-react"
import Link from "next/link"

interface Chart {
  id: string
  name: string
  type: string
  datasetName: string
  createdAt: string
  views: number
  description: string
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

export function ChartManager() {
  const [charts, setCharts] = useState<Chart[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        // Simulate API call - in real app, this would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCharts([
          {
            id: "1",
            name: "Sales by Region",
            type: "bar",
            datasetName: "Sales Q4 2024",
            createdAt: "2024-01-15",
            views: 24,
            description: "Quarterly sales performance across different regions",
          },
          {
            id: "2",
            name: "Revenue Trend",
            type: "line",
            datasetName: "Sales Q4 2024",
            createdAt: "2024-01-14",
            views: 18,
            description: "Monthly revenue growth over the quarter",
          },
          {
            id: "3",
            name: "Satisfaction Distribution",
            type: "pie",
            datasetName: "Customer Survey",
            createdAt: "2024-01-12",
            views: 31,
            description: "Customer satisfaction ratings breakdown",
          },
          {
            id: "4",
            name: "Traffic Over Time",
            type: "area",
            datasetName: "Website Analytics",
            createdAt: "2024-01-10",
            views: 42,
            description: "Website visitor trends and patterns",
          },
          {
            id: "5",
            name: "Product Performance",
            type: "bar",
            datasetName: "Product Inventory",
            createdAt: "2024-01-08",
            views: 15,
            description: "Top performing products by sales volume",
          },
        ])
      } catch (error) {
        console.error("Failed to fetch charts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCharts()
  }, [])

  const filteredCharts = charts.filter(
    (chart) =>
      chart.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chart.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chart.datasetName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Charts</h1>
          <p className="text-muted-foreground">Manage and share your data visualizations</p>
        </div>
        <Link href="/dashboard/datasets">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Chart
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search charts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                    </div>
                    <div className="h-32 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          : filteredCharts.map((chart) => {
              const Icon = chartIcons[chart.type as keyof typeof chartIcons] || BarChart3
              const colorClass = chartColors[chart.type as keyof typeof chartColors] || chartColors.bar

              return (
                <Card key={chart.id} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Chart Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold truncate">{chart.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{chart.datasetName}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Chart Preview */}
                      <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                      </div>

                      {/* Chart Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">{chart.description}</p>

                      {/* Chart Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {chart.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{chart.views} views</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(chart.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button variant="ghost" size="sm" className="flex-1 gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1 gap-2">
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
      </div>

      {filteredCharts.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No charts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Create your first chart from a dataset"}
            </p>
            <Link href="/dashboard/datasets">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Chart
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
