import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentDatasets } from "@/components/dashboard/recent-datasets"
import { RecentCharts } from "@/components/dashboard/recent-charts"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Card, CardContent } from "@/components/ui/card"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="space-y-8">
            <DashboardStats />
            <QuickActions />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentDatasets />
              <RecentCharts />
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  )
}
