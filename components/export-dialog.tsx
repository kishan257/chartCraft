"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Loader2, CheckCircle } from "lucide-react"

interface ExportDialogProps {
  chartId: string
  children: React.ReactNode
}

export function ExportDialog({ chartId, children }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [format, setFormat] = useState("png")
  const [quality, setQuality] = useState("high")
  const [includeTitle, setIncludeTitle] = useState(true)
  const [includeLegend, setIncludeLegend] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<any>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportResult(null)

    try {
      const response = await fetch(`/api/charts/${chartId}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format,
          options: {
            quality,
            includeTitle,
            includeLegend,
          },
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Export failed")
      }

      setExportResult(result.export)

      // Simulate download
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = result.export.downloadUrl
        link.download = result.export.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 1000)
    } catch (error) {
      console.error("Export error:", error)
      setExportResult({ error: error instanceof Error ? error.message : "Export failed" })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Chart
          </DialogTitle>
          <DialogDescription>Choose your export format and options</DialogDescription>
        </DialogHeader>

        {!exportResult && (
          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label>Export Format</Label>
              <RadioGroup value={format} onValueChange={setFormat}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="png" />
                  <Label htmlFor="png">PNG - Best for web and presentations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="svg" id="svg" />
                  <Label htmlFor="svg">SVG - Vector format, scalable</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF - Print-ready document</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpg" id="jpg" />
                  <Label htmlFor="jpg">JPG - Smaller file size</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Quality Selection */}
            <div className="space-y-3">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (72 DPI)</SelectItem>
                  <SelectItem value="medium">Medium (150 DPI)</SelectItem>
                  <SelectItem value="high">High (300 DPI)</SelectItem>
                  <SelectItem value="ultra">Ultra (600 DPI)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>Include Elements</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="title" checked={includeTitle} onCheckedChange={setIncludeTitle} />
                  <Label htmlFor="title">Chart title</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="legend" checked={includeLegend} onCheckedChange={setIncludeLegend} />
                  <Label htmlFor="legend">Legend</Label>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Chart
                </>
              )}
            </Button>
          </div>
        )}

        {/* Export Result */}
        {exportResult && (
          <div className="text-center space-y-4">
            {exportResult.error ? (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-red-600 text-xl">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-700">Export Failed</h3>
                  <p className="text-sm text-red-600">{exportResult.error}</p>
                </div>
                <Button
                  onClick={() => {
                    setExportResult(null)
                    setIsExporting(false)
                  }}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-700">Export Successful!</h3>
                  <p className="text-sm text-muted-foreground">Your chart has been downloaded</p>
                </div>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    setExportResult(null)
                  }}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
