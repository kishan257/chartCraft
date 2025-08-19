import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg shimmer" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded shimmer" />
            <div className="h-3 bg-muted rounded shimmer w-2/3" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 bg-muted rounded shimmer" />
      </CardContent>
    </Card>
  )
}

export function ChartLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded shimmer w-48" />
          <div className="h-4 bg-muted rounded shimmer w-32" />
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-muted rounded shimmer" />
          <div className="w-8 h-8 bg-muted rounded shimmer" />
          <div className="w-8 h-8 bg-muted rounded shimmer" />
        </div>
      </div>
      <div className="h-96 bg-muted rounded shimmer" />
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="h-4 bg-muted rounded shimmer mb-2 w-24" />
        <div className="h-3 bg-muted rounded shimmer" />
      </div>
    </div>
  )
}
