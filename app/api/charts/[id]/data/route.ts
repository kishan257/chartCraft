import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Get chart configuration
    const { data: chart, error: chartError } = await supabase
      .from("charts")
      .select("*, datasets(*)")
      .eq("id", params.id)
      .single()

    if (chartError || !chart) {
      return NextResponse.json({ error: "Chart not found" }, { status: 404 })
    }

    const dataset = chart.datasets
    const config = chart.config

    // Process data based on chart configuration
    let processedData = dataset.data

    // Apply grouping and aggregation if specified
    if (config.groupBy && config.aggregation && config.yAxis) {
      const grouped = processedData.reduce((acc: any, row: any) => {
        const key = row[config.groupBy]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(row)
        return acc
      }, {})

      processedData = Object.entries(grouped).map(([key, rows]: [string, any]) => {
        const values = (rows as any[]).map((row) => Number(row[config.yAxis])).filter((v) => !isNaN(v))

        let aggregatedValue = 0
        switch (config.aggregation) {
          case "sum":
            aggregatedValue = values.reduce((a, b) => a + b, 0)
            break
          case "average":
            aggregatedValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
            break
          case "count":
            aggregatedValue = values.length
            break
          case "min":
            aggregatedValue = values.length > 0 ? Math.min(...values) : 0
            break
          case "max":
            aggregatedValue = values.length > 0 ? Math.max(...values) : 0
            break
          default:
            aggregatedValue = values.reduce((a, b) => a + b, 0)
        }

        return {
          [config.groupBy]: key,
          [config.yAxis]: aggregatedValue,
          count: values.length,
        }
      })
    }

    // Sort data if needed
    if (config.xAxis && processedData.length > 0) {
      processedData.sort((a: any, b: any) => {
        const aVal = a[config.xAxis]
        const bVal = b[config.xAxis]

        // Handle different data types
        if (typeof aVal === "number" && typeof bVal === "number") {
          return aVal - bVal
        }
        if (aVal instanceof Date && bVal instanceof Date) {
          return aVal.getTime() - bVal.getTime()
        }
        return String(aVal).localeCompare(String(bVal))
      })
    }

    return NextResponse.json({
      chart: {
        id: chart.id,
        name: chart.name,
        type: chart.chart_type,
        config: chart.config,
        insights: chart.ai_insights,
      },
      data: processedData,
      dataset: {
        name: dataset.name,
        columns: dataset.columns,
      },
    })
  } catch (error) {
    console.error("Chart data error:", error)
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 })
  }
}
