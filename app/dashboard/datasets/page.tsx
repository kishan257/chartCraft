import { DatasetManager } from "@/components/dashboard/dataset-manager"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function DatasetsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <DatasetManager />
      </main>
    </div>
  )
}
