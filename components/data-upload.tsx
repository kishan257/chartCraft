"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, Database, Link, Sparkles, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { DataPreview } from "./data-preview"
import { Progress } from "@/components/ui/progress"
import { DatabaseSetupNotice } from "./database-setup-notice"

interface UploadResult {
  success: boolean
  dataset?: {
    id: string
    name: string
    rowCount: number
    columnCount: number
    columns: Array<{ name: string; type: string; displayName: string }>
    preview: any[]
  }
  error?: string
  setupRequired?: boolean
}

interface DataUploadProps {
  onDatasetCreated?: (datasetId: string) => void
}

export function DataUpload({ onDatasetCreated }: DataUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | "manual">("file")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [manualData, setManualData] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setIsProcessing(true)
      setUploadResult(null)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", file.name.replace(/\.[^/.]+$/, ""))

        const response = await fetch("/api/datasets", {
          method: "POST",
          body: formData,
        })

        let result
        const contentType = response.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
          result = await response.json()
        } else {
          // Handle HTML error responses
          const text = await response.text()
          result = {
            success: false,
            error: response.ok ? "Unknown error occurred" : `Server error: ${response.status}`,
            setupRequired:
              text.includes("Database not initialized") || (text.includes("table") && text.includes("does not exist")),
          }
        }

        setUploadProgress(100)

        setTimeout(() => {
          setUploadResult(result)
          clearInterval(progressInterval)
          if (result.success && result.dataset && onDatasetCreated) {
            onDatasetCreated(result.dataset.id)
          }
        }, 500)
      } catch (error) {
        console.error("Upload error:", error)
        setUploadResult({
          success: false,
          error: "Failed to upload file. Please try again.",
        })
        clearInterval(progressInterval)
      } finally {
        setTimeout(() => {
          setIsProcessing(false)
          setUploadProgress(0)
        }, 1000)
      }
    },
    [onDatasetCreated],
  )

  const handleManualDataSubmit = useCallback(async () => {
    if (!manualData.trim()) return

    setIsProcessing(true)
    setUploadResult(null)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 15))
    }, 150)

    try {
      const blob = new Blob([manualData], { type: "text/csv" })
      const file = new File([blob], "manual-data.csv", { type: "text/csv" })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", "Manual Data Entry")

      const response = await fetch("/api/datasets", {
        method: "POST",
        body: formData,
      })

      let result
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        // Handle HTML error responses
        const text = await response.text()
        result = {
          success: false,
          error: response.ok ? "Unknown error occurred" : `Server error: ${response.status}`,
          setupRequired:
            text.includes("Database not initialized") || (text.includes("table") && text.includes("does not exist")),
        }
      }

      setUploadProgress(100)

      setTimeout(() => {
        setUploadResult(result)
        clearInterval(progressInterval)
        if (result.success && result.dataset && onDatasetCreated) {
          onDatasetCreated(result.dataset.id)
        }
      }, 500)
    } catch (error) {
      console.error("Manual data error:", error)
      setUploadResult({
        success: false,
        error: "Failed to process manual data. Please check the format.",
      })
      clearInterval(progressInterval)
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
        setUploadProgress(0)
      }, 1000)
    }
  }, [manualData, onDatasetCreated])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "text/plain": [".txt", ".tsv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/json": [".json"],
      "application/vnd.ms-excel.sheet.macroEnabled.12": [".xlsm"],
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12": [".xlsb"],
      "text/tab-separated-values": [".tsv"],
      "application/xml": [".xml"],
      "text/xml": [".xml"],
    },
    maxFiles: 1,
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0]
      if (rejection) {
        const errors = rejection.errors.map((e) => e.message).join(", ")
        setUploadResult({
          success: false,
          error: `File rejected: ${errors}. Please upload CSV, Excel, JSON, or text files.`,
        })
      }
    },
  })

  if (uploadResult?.setupRequired) {
    return <DatabaseSetupNotice />
  }

  if (uploadResult?.success && uploadResult.dataset) {
    return (
      <section id="upload" className="space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
            <CheckCircle className="w-4 h-4" />
            Data Uploaded Successfully
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-serif">Your Data is Ready</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've analyzed your dataset and it's ready for visualization. Review the preview below and start creating
            charts.
          </p>
        </div>

        <div className="animate-fade-in-up delay-200">
          <DataPreview dataset={uploadResult.dataset} />
        </div>

        <div className="text-center animate-fade-in-up delay-300">
          <Button
            onClick={() => {
              setUploadResult(null)
              setManualData("")
            }}
            variant="outline"
            className="mr-4 bg-transparent"
          >
            Upload Another Dataset
          </Button>
          <Button
            className="gap-2 group hover:scale-105 transition-transform"
            onClick={() => onDatasetCreated?.(uploadResult.dataset!.id)}
          >
            <Sparkles className="w-4 h-4 group-hover:animate-spin" />
            Create Charts
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section id="upload" className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold font-serif">Upload Your Data</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get started by uploading your dataset. We support CSV, Excel, JSON, and direct integrations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { method: "file", icon: FileSpreadsheet, title: "Upload File", desc: "CSV, Excel, or JSON files" },
          { method: "url", icon: Link, title: "Import from URL", desc: "Google Sheets, APIs, or web data" },
          { method: "manual", icon: Database, title: "Manual Entry", desc: "Type or paste your data" },
        ].map((option, index) => (
          <Card
            key={option.method}
            className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in-up ${
              uploadMethod === option.method ? "ring-2 ring-primary shadow-lg" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setUploadMethod(option.method as any)}
          >
            <CardHeader className="text-center">
              <option.icon className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle>{option.title}</CardTitle>
              <CardDescription>{option.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto animate-fade-in-up delay-300">
        <CardContent className="p-8">
          {uploadResult?.error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{uploadResult.error}</span>
            </div>
          )}

          {uploadMethod === "file" && (
            <div className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer group
                  ${isDragActive ? "border-primary bg-primary/5 scale-105" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"}`}
              >
                <input {...getInputProps()} />
                <Upload
                  className={`w-12 h-12 text-muted-foreground mx-auto mb-4 transition-transform ${isDragActive ? "scale-110 text-primary" : "group-hover:scale-110"}`}
                />
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? "Drop your files here" : "Drag & drop your data files"}
                </h3>
                <p className="text-muted-foreground mb-4">or click to browse your computer</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports CSV, Excel (.xlsx, .xls), JSON, TSV, and text files
                </p>
                <Button
                  variant="outline"
                  disabled={isProcessing}
                  className="group-hover:scale-105 transition-transform bg-transparent"
                >
                  {isProcessing ? "Processing..." : "Choose Files"}
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-center gap-3 p-4 bg-muted rounded-lg">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    <span>AI is analyzing your data...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadMethod === "url" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="data-url">Data Source URL</Label>
                <Input id="data-url" placeholder="https://docs.google.com/spreadsheets/..." className="mt-2" />
              </div>
              <Button className="w-full gap-2" disabled>
                <Sparkles className="w-4 h-4" />
                Import & Analyze (Coming Soon)
              </Button>
            </div>
          )}

          {uploadMethod === "manual" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-data">Paste Your Data (CSV Format)</Label>
                <textarea
                  id="manual-data"
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  placeholder="Name,Sales,Region&#10;John,1000,North&#10;Jane,1500,South&#10;Bob,1200,East"
                  className="mt-2 w-full h-32 p-3 border border-input rounded-md resize-none font-mono text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use comma-separated values with headers in the first row
                </p>
              </div>
              <Button
                className="w-full gap-2 group hover:scale-105 transition-transform"
                onClick={handleManualDataSubmit}
                disabled={isProcessing || !manualData.trim()}
              >
                <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                {isProcessing ? "Processing Data..." : "Process Data"}
              </Button>

              {isProcessing && (
                <div className="space-y-2 animate-fade-in">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
