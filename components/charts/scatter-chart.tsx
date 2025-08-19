"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ScatterChartProps {
  data: any[]
  config: {
    xAxis?: string
    yAxis?: string
    title?: string
    colors?: string[]
  }
}

const defaultColors = ["hsl(var(--chart-4))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"]

export function ScatterChartComponent({ data, config }: ScatterChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No data available</p>
      </div>
    )
  }

  const colors = config.colors || defaultColors

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          dataKey={config.xAxis}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          dataKey={config.yAxis}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{config.xAxis}</span>
                      <span className="font-bold text-muted-foreground">{data[config.xAxis || "x"]}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">{config.yAxis}</span>
                      <span className="font-bold">{data[config.yAxis || "y"]}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Scatter dataKey={config.yAxis} fill={colors[0]} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
