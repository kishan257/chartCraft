"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, PieChart, TrendingUp, Zap, Eye, AreaChart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const chartTypes = [
  {
    id: "bar",
    icon: BarChart3,
    name: "Bar Charts",
    description: "Perfect for comparing categories and showing rankings",
    badge: "Most Popular",
    color: "bg-emerald-500",
    previewData: [
      { name: "Jan", value: 400 },
      { name: "Feb", value: 300 },
      { name: "Mar", value: 600 },
      { name: "Apr", value: 800 },
    ],
  },
  {
    id: "line",
    icon: LineChart,
    name: "Line Charts",
    description: "Ideal for showing trends and changes over time",
    badge: "Trending",
    color: "bg-blue-500",
    previewData: [
      { name: "Week 1", value: 100 },
      { name: "Week 2", value: 200 },
      { name: "Week 3", value: 150 },
      { name: "Week 4", value: 300 },
    ],
  },
  {
    id: "pie",
    icon: PieChart,
    name: "Pie Charts",
    description: "Great for showing parts of a whole and percentages",
    badge: "Classic",
    color: "bg-purple-500",
    previewData: [
      { name: "Desktop", value: 45 },
      { name: "Mobile", value: 35 },
      { name: "Tablet", value: 20 },
    ],
  },
  {
    id: "scatter",
    icon: TrendingUp,
    name: "Scatter Plots",
    description: "Excellent for showing relationships between variables",
    badge: "Advanced",
    color: "bg-orange-500",
    previewData: [
      { x: 10, y: 20 },
      { x: 20, y: 35 },
      { x: 30, y: 25 },
      { x: 40, y: 45 },
    ],
  },
  {
    id: "area",
    icon: AreaChart,
    name: "Area Charts",
    description: "Perfect for showing cumulative totals over time",
    badge: "Popular",
    color: "bg-teal-500",
    previewData: [
      { name: "Q1", value: 1000 },
      { name: "Q2", value: 1500 },
      { name: "Q3", value: 1200 },
      { name: "Q4", value: 1800 },
    ],
  },
  {
    id: "donut",
    icon: PieChart,
    name: "Donut Charts",
    description: "Modern alternative to pie charts with better readability",
    badge: "Modern",
    color: "bg-pink-500",
    previewData: [
      { name: "Sales", value: 60 },
      { name: "Marketing", value: 25 },
      { name: "Support", value: 15 },
    ],
  },
]

export function ChartGallery() {
  const router = useRouter()
  const [selectedChart, setSelectedChart] = useState<string | null>(null)

  const handleCreateChart = (chartType: string) => {
    // Store the selected chart type in localStorage for the create page
    localStorage.setItem("selectedChartType", chartType)
    router.push("/create")
  }

  const handlePreviewChart = (chartId: string) => {
    setSelectedChart(selectedChart === chartId ? null : chartId)
  }

  return (
    <section id="gallery" className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold font-serif">Chart Types & Templates</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose from our extensive library of chart types, or let our AI recommend the perfect visualization for your
          data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chartTypes.map((chart, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center pb-4">
              <div
                className={`w-16 h-16 ${chart.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <chart.icon className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <CardTitle className="text-lg">{chart.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {chart.badge}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{chart.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedChart === chart.id && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground mb-2">Sample Data Preview:</div>
                  <div className="text-xs font-mono">{JSON.stringify(chart.previewData.slice(0, 2), null, 2)}...</div>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 bg-transparent"
                  onClick={() => handlePreviewChart(chart.id)}
                >
                  <Eye className="w-3 h-3" />
                  {selectedChart === chart.id ? "Hide" : "Preview"}
                </Button>
                <Button size="sm" className="flex-1 gap-1" onClick={() => handleCreateChart(chart.id)}>
                  <Zap className="w-3 h-3" />
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" className="gap-2 bg-transparent" onClick={() => router.push("/create")}>
          Start Creating Free
          <TrendingUp className="w-4 h-4" />
        </Button>
      </div>
    </section>
  )
}
