"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, MoreHorizontal, Eye, BarChart3 } from "lucide-react"
import Link from "next/link"

interface Dataset {
  id: string
  name: string
  description: string
  rowCount: number
  columnCount: number
  createdAt: string
  chartCount: number
}

export function RecentDatasets() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await fetch("/api/datasets?limit=3")
        if (response.ok) {
          const data = await response.json()
          setDatasets(data.datasets || [])
        } else {
          // Fallback to mock data if API fails
          setDatasets([
            {
              id: "1",
              name: "Sales Q4 2024",
              description: "Quarterly sales data with regional breakdown",
              rowCount: 1250,
              columnCount: 8,
              createdAt: "2024-01-15",
              chartCount: 3,
            },
            {
              id: "2",
              name: "Customer Survey",
              description: "User satisfaction and feedback responses",
              rowCount: 892,
              columnCount: 12,
              createdAt: "2024-01-12",
              chartCount: 2,
            },
            {
              id: "3",
              name: "Website Analytics",
              description: "Traffic and engagement metrics",
              rowCount: 2341,
              columnCount: 6,
              createdAt: "2024-01-10",
              chartCount: 5,
            },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch datasets:", error)
        // Use mock data as fallback
        setDatasets([
          {
            id: "1",
            name: "Sales Q4 2024",
            description: "Quarterly sales data with regional breakdown",
            rowCount: 1250,
            columnCount: 8,
            createdAt: "2024-01-15",
            chartCount: 3,
          },
          {
            id: "2",
            name: "Customer Survey",
            description: "User satisfaction and feedback responses",
            rowCount: 892,
            columnCount: 12,
            createdAt: "2024-01-12",
            chartCount: 2,
          },
          {
            id: "3",
            name: "Website Analytics",
            description: "Traffic and engagement metrics",
            rowCount: 2341,
            columnCount: 6,
            createdAt: "2024-01-10",
            chartCount: 5,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  const handleViewDataset = (datasetId: string) => {
    window.open(`/dashboard/datasets/${datasetId}`, "_blank")
  }

  const handleCreateChart = (datasetId: string) => {
    window.open(`/create?dataset=${datasetId}`, "_blank")
  }

  const handleMoreOptions = (datasetId: string) => {
    // Could open a dropdown menu or modal with more options
    console.log("More options for dataset:", datasetId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-serif">Recent Datasets</CardTitle>
          <CardDescription>Your latest uploaded data sources</CardDescription>
        </div>
        <Link href="/dashboard/datasets">
          <Button variant="outline" size="sm" className="bg-transparent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{dataset.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{dataset.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {dataset.rowCount.toLocaleString()} rows • {dataset.columnCount} columns
                    </span>
                    {dataset.chartCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {dataset.chartCount} charts
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDataset(dataset.id)} title="View Dataset">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCreateChart(dataset.id)} title="Create Chart">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleMoreOptions(dataset.id)} title="More Options">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
