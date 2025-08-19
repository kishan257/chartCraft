import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const ChartRecommendationSchema = z.object({
  recommendedCharts: z.array(
    z.object({
      type: z.enum(["bar", "line", "pie", "scatter", "area", "histogram", "heatmap"]),
      title: z.string(),
      description: z.string(),
      reasoning: z.string(),
      confidence: z.number().min(0).max(100),
      config: z.object({
        xAxis: z.string().optional(),
        yAxis: z.string().optional(),
        groupBy: z.string().optional(),
        aggregation: z.enum(["sum", "count", "average", "min", "max"]).optional(),
        colors: z.array(z.string()).optional(),
      }),
    }),
  ),
  insights: z.array(
    z.object({
      type: z.enum(["trend", "anomaly", "correlation", "distribution", "summary"]),
      title: z.string(),
      description: z.string(),
      confidence: z.number().min(0).max(100),
    }),
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { datasetId } = await request.json()

    if (!datasetId) {
      return NextResponse.json({ error: "Dataset ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Fetch dataset
    const { data: dataset, error } = await supabase.from("datasets").select("*").eq("id", datasetId).single()

    if (error || !dataset) {
      if (error?.message?.includes("table") && error?.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            error: "Database not initialized",
            message: "Please run the database setup script to create the required tables.",
            setupRequired: true,
          },
          { status: 503 },
        )
      }
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    const dataSample = dataset.data.slice(0, 10)
    const columns = dataset.columns
    const rowCount = Array.isArray(dataset.data) ? dataset.data.length : 0

    const prompt = `Analyze this dataset and recommend the best chart types and provide insights.

Dataset Information:
- Name: ${dataset.name}
- Rows: ${rowCount}
- Columns: ${columns.length}

Column Details:
${columns
  .map(
    (col: any) =>
      `- ${col.displayName} (${col.name}): ${col.type} - ${getColumnSummary(dataset.data, col.name, col.type)}`,
  )
  .join("\n")}

Sample Data (first 10 rows):
${JSON.stringify(dataSample, null, 2)}

Please recommend 2-4 different chart types that would best visualize this data, explaining your reasoning for each. Also provide insights about patterns, trends, or interesting findings in the data.

Consider:
1. Data types and relationships between columns
2. Best practices for data visualization
3. What story the data might tell
4. Potential correlations or patterns
5. Appropriate aggregations for the data size

For each chart recommendation, specify:
- Chart type (bar, line, pie, scatter, area, histogram, heatmap)
- Which columns to use for x/y axes or grouping
- Appropriate aggregation method if needed
- Why this chart type is suitable

For insights, identify:
- Trends in the data
- Anomalies or outliers
- Correlations between variables
- Distribution patterns
- Key summary statistics`

    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt,
      schema: ChartRecommendationSchema,
    })

    // Store the AI recommendations
    const chartPromises = result.object.recommendedCharts.map(async (chart) => {
      const { data: savedChart, error: chartError } = await supabase
        .from("charts")
        .insert({
          dataset_id: datasetId,
          name: chart.title,
          type: chart.type, // Fixed column name
          config: {
            ...chart.config,
            title: chart.title,
            description: chart.description,
            reasoning: chart.reasoning,
            confidence: chart.confidence,
          },
          ai_insights: chart.reasoning,
        })
        .select()
        .single()

      if (chartError) {
        console.error("Error saving chart:", chartError)
        return null
      }

      return savedChart
    })

    const savedCharts = await Promise.all(chartPromises)

    return NextResponse.json({
      success: true,
      recommendations: result.object.recommendedCharts,
      insights: result.object.insights,
      charts: savedCharts.filter(Boolean),
    })
  } catch (error) {
    console.error("AI generation error:", error)
    return NextResponse.json({ error: "Failed to generate chart recommendations" }, { status: 500 })
  }
}

function getColumnSummary(data: any[], columnName: string, columnType: string): string {
  const values = data.map((row) => row[columnName]).filter((v) => v !== null && v !== undefined && v !== "")

  if (values.length === 0) return "No data"

  switch (columnType) {
    case "integer":
    case "decimal":
      const numbers = values.map(Number).filter((n) => !isNaN(n))
      if (numbers.length === 0) return "No numeric data"
      const min = Math.min(...numbers)
      const max = Math.max(...numbers)
      const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length
      return `Range: ${min} to ${max}, Average: ${avg.toFixed(2)}`

    case "text":
      const uniqueValues = new Set(values)
      return `${uniqueValues.size} unique values, most common: ${getMostCommon(values)}`

    case "date":
      const dates = values.map((v) => new Date(v)).filter((d) => !isNaN(d.getTime()))
      if (dates.length === 0) return "No valid dates"
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))
      return `Range: ${minDate.toLocaleDateString()} to ${maxDate.toLocaleDateString()}`

    case "boolean":
      const trueCount = values.filter((v) => v === true || v === "true").length
      const falseCount = values.length - trueCount
      return `True: ${trueCount}, False: ${falseCount}`

    default:
      return `${values.length} values`
  }
}

function getMostCommon(values: any[]): string {
  const counts = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {})

  const mostCommon = Object.entries(counts).reduce((a, b) => (counts[a[0]] > counts[b[0]] ? a : b))
  return mostCommon[0]
}
