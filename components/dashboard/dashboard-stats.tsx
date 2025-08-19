"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, BarChart3, TrendingUp, Sparkles } from "lucide-react"

interface Stats {
  totalDatasets: number
  totalCharts: number
  totalRows: number
  aiInsights: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalDatasets: 0,
    totalCharts: 0,
    totalRows: 0,
    aiInsights: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API call - in real app, this would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStats({
          totalDatasets: 12,
          totalCharts: 28,
          totalRows: 45672,
          aiInsights: 156,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Datasets",
      value: stats.totalDatasets.toLocaleString(),
      description: "Uploaded data sources",
      icon: Database,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Charts Created",
      value: stats.totalCharts.toLocaleString(),
      description: "Visualizations generated",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Data Points",
      value: stats.totalRows.toLocaleString(),
      description: "Rows processed",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "AI Insights",
      value: stats.aiInsights.toLocaleString(),
      description: "Generated recommendations",
      icon: Sparkles,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <div className="h-8 bg-muted rounded animate-pulse" /> : stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
