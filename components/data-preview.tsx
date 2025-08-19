import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Hash, Type, Calendar, ToggleLeft } from "lucide-react"
import { ChartGenerator } from "./chart-generator"

interface DataPreviewProps {
  dataset: {
    id: string
    name: string
    rowCount: number
    columnCount: number
    columns: Array<{ name: string; type: string; displayName: string }>
    preview: any[]
  }
}

const typeIcons = {
  integer: Hash,
  decimal: Hash,
  text: Type,
  date: Calendar,
  boolean: ToggleLeft,
}

const typeColors = {
  integer: "bg-blue-100 text-blue-700",
  decimal: "bg-green-100 text-green-700",
  text: "bg-gray-100 text-gray-700",
  date: "bg-purple-100 text-purple-700",
  boolean: "bg-orange-100 text-orange-700",
}

export function DataPreview({ dataset }: DataPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Dataset Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">{dataset.name}</CardTitle>
              <CardDescription>
                {dataset.rowCount.toLocaleString()} rows • {dataset.columnCount} columns
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Column Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Column Analysis</CardTitle>
          <CardDescription>AI has automatically detected the data types for each column</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataset.columns.map((column, index) => {
              const Icon = typeIcons[column.type as keyof typeof typeIcons] || Type
              const colorClass = typeColors[column.type as keyof typeof typeColors] || typeColors.text

              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{column.displayName}</div>
                    <div className="text-sm text-muted-foreground truncate">{column.name}</div>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${colorClass}`}>
                    {column.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Preview</CardTitle>
          <CardDescription>First 5 rows of your dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {dataset.columns.map((column, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      {column.displayName}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataset.preview.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {dataset.columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="whitespace-nowrap">
                        {row[column.name]?.toString() || "—"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Chart Generation */}
      <ChartGenerator datasetId={dataset.id} datasetName={dataset.name} />
    </div>
  )
}
