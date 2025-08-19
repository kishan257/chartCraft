import { AlertTriangle, Database, Play } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DatabaseSetupNotice() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Database Setup Required</AlertTitle>
        <AlertDescription>
          The database tables haven't been created yet. Please run the setup script to initialize the database.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Initialization
          </CardTitle>
          <CardDescription>Run the SQL script to create the required tables for ChartCraft</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Required Tables:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • <code>datasets</code> - Store uploaded data
              </li>
              <li>
                • <code>charts</code> - Store generated charts
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Play className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Run script: <code>scripts/02-create-tables-fixed.sql</code>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
