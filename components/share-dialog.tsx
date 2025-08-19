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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Share2, Copy, CheckCircle, ExternalLink, Twitter, Linkedin, Facebook } from "lucide-react"

interface ShareDialogProps {
  chartId: string
  children: React.ReactNode
}

export function ShareDialog({ chartId, children }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareData, setShareData] = useState<any>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [embedWidth, setEmbedWidth] = useState("800")
  const [embedHeight, setEmbedHeight] = useState("600")

  const generateShareLink = async (type: string, settings?: any) => {
    try {
      const response = await fetch(`/api/charts/${chartId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, settings }),
      })

      const result = await response.json()

      if (result.success) {
        setShareData({ ...shareData, [type]: result.share })
      }
    } catch (error) {
      console.error("Share error:", error)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  const handleTabChange = (tab: string) => {
    if (!shareData?.[tab]) {
      const settings = tab === "embed" ? { width: embedWidth, height: embedHeight } : undefined
      generateShareLink(tab, settings)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Chart
          </DialogTitle>
          <DialogDescription>Share your chart with others or embed it on your website</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="public_link" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="public_link">Public Link</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          {/* Public Link Tab */}
          <TabsContent value="public_link" className="space-y-4">
            <div className="space-y-3">
              <Label>Public Link</Label>
              <p className="text-sm text-muted-foreground">
                Anyone with this link can view your chart. No login required.
              </p>
              <div className="flex gap-2">
                <Input
                  value={shareData?.public_link?.url || "Generating link..."}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shareData?.public_link?.url, "public_link")}
                  disabled={!shareData?.public_link?.url}
                >
                  {copiedField === "public_link" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {shareData?.public_link?.url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => window.open(shareData.public_link.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview Link
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Embed Code Tab */}
          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-3">
              <Label>Embed Dimensions</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="text-sm">
                    Width (px)
                  </Label>
                  <Input
                    id="width"
                    value={embedWidth}
                    onChange={(e) => setEmbedWidth(e.target.value)}
                    placeholder="800"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm">
                    Height (px)
                  </Label>
                  <Input
                    id="height"
                    value={embedHeight}
                    onChange={(e) => setEmbedHeight(e.target.value)}
                    placeholder="600"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateShareLink("embed", { width: embedWidth, height: embedHeight })}
              >
                Update Embed Code
              </Button>
            </div>

            <div className="space-y-3">
              <Label>Embed Code</Label>
              <p className="text-sm text-muted-foreground">Copy this code and paste it into your website or blog.</p>
              <div className="relative">
                <Textarea
                  value={shareData?.embed?.embedCode || "Generating embed code..."}
                  readOnly
                  className="font-mono text-sm min-h-[100px]"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => copyToClipboard(shareData?.embed?.embedCode, "embed")}
                  disabled={!shareData?.embed?.embedCode}
                >
                  {copiedField === "embed" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-4">
            <div className="space-y-3">
              <Label>Share on Social Media</Label>
              <p className="text-sm text-muted-foreground">Share your chart on popular social platforms.</p>

              {shareData?.social?.platforms && (
                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-3 bg-transparent"
                    onClick={() => window.open(shareData.social.platforms.twitter, "_blank")}
                  >
                    <Twitter className="w-5 h-5 text-blue-500" />
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 bg-transparent"
                    onClick={() => window.open(shareData.social.platforms.linkedin, "_blank")}
                  >
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    Share on LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-3 bg-transparent"
                    onClick={() => window.open(shareData.social.platforms.facebook, "_blank")}
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                    Share on Facebook
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
