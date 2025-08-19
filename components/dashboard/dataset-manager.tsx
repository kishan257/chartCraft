"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Database, Search, Plus, Filter, MoreHorizontal, Eye, BarChart3, Trash2 } from "lucide-react"
import Link from "next/link"

interface Dataset {
  id: string
  name: string
  description: string
  rowCount: number
  columnCount: number
  createdAt: string
  chartCount: number
  size: string
}

export function DatasetManager() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        // Simulate API call - in real app, this would fetch from your API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setDatasets([
          {
            id: "1",
            name: "Sales Q4 2024",
            description: "Quarterly sales data with regional breakdown",
            rowCount: 1250,
            columnCount: 8,
            createdAt: "2024-01-15",
            chartCount: 3,
            size: "2.4 MB",
          },
          {
            id: "2",
            name: "Customer Survey",
            description: "User satisfaction and feedback responses",
            rowCount: 892,
            columnCount: 12,
            createdAt: "2024-01-12",
            chartCount: 2,
            size: "1.8 MB",
          },
          {
            id: "3",
            name: "Website Analytics",
            description: "Traffic and engagement metrics",
            rowCount: 2341,
            columnCount: 6,
            createdAt: "2024-01-10",
            chartCount: 5,
            size: "3.1 MB",
          },
          {
            id: "4",
            name: "Product Inventory",
            description: "Stock levels and product information",
            rowCount: 567,
            columnCount: 15,
            createdAt: "2024-01-08",
            chartCount: 1,
            size: "1.2 MB",
          },
          {
            id: "5",
            name: "Employee Performance",
            description: "HR metrics and performance reviews",
            rowCount: 234,
            columnCount: 10,
            createdAt: "2024-01-05",
            chartCount: 0,
            size: "0.8 MB",
          },
        ])
      } catch (error) {
        console.error("Failed to fetch datasets:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasets()
  }, [])

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif">Datasets</h1>
          <p className="text-muted-foreground">Manage your data sources and create visualizations</p>
        </div>
        <Link href="/">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Dataset
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
                placeholder="Search datasets..."
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

      {/* Datasets Grid */}
      <div className="grid gap-6">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : filteredDatasets.map((dataset) => (
              <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold truncate">{dataset.name}</h3>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{dataset.description}</p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>{dataset.rowCount.toLocaleString()} rows</span>
                        <span>{dataset.columnCount} columns</span>
                        <span>{dataset.size}</span>
                        <span>Created {new Date(dataset.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        {dataset.chartCount > 0 ? (
                          <Badge variant="secondary">
                            {dataset.chartCount} chart{dataset.chartCount !== 1 ? "s" : ""}
                          </Badge>
                        ) : (
                          <Badge variant="outline">No charts yet</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {filteredDatasets.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No datasets found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try adjusting your search terms" : "Upload your first dataset to get started"}
            </p>
            <Link href="/">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Upload Dataset
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
