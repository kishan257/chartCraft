"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DataUpload } from "@/components/data-upload"
import { ChartGenerator } from "@/components/chart-generator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreatePage() {
  const [datasetId, setDatasetId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold font-serif mb-2">Create New Chart</h1>
          <p className="text-muted-foreground">Upload your data and let AI generate beautiful visualizations</p>
        </div>

        {!datasetId ? <DataUpload onDatasetCreated={setDatasetId} /> : <ChartGenerator datasetId={datasetId} />}
      </main>
    </div>
  )
}
