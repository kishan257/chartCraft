import { ChartManager } from "@/components/dashboard/chart-manager"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <ChartManager />
      </main>
    </div>
  )
}
