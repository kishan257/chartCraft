import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Brain, Lightbulb, TrendingUp, AlertCircle } from "lucide-react"

const insights = [
  {
    icon: TrendingUp,
    type: "Trend Analysis",
    title: "Sales Growth Detected",
    description: "Your Q4 sales show a 23% increase compared to Q3, with December being the strongest month.",
    confidence: 95,
    color: "text-green-600",
  },
  {
    icon: AlertCircle,
    type: "Anomaly Detection",
    title: "Unusual Pattern Found",
    description: "There's a significant drop in engagement on Tuesdays that might need investigation.",
    confidence: 87,
    color: "text-orange-600",
  },
  {
    icon: Lightbulb,
    type: "Recommendation",
    title: "Visualization Suggestion",
    description: "A stacked bar chart would better show the relationship between regions and product categories.",
    confidence: 92,
    color: "text-blue-600",
  },
]

export function AIInsights() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Brain className="w-4 h-4" />
          AI-Powered Insights
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-serif">Let AI Analyze Your Data</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our advanced AI doesn't just create charts - it discovers patterns, identifies trends, and provides actionable
          insights from your data.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${insight.color}`}>
                  <insight.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confident
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-medium">{insight.type}</div>
                <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-sm leading-relaxed">{insight.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold font-serif mb-2">Ready to Discover Hidden Insights?</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Upload your data and let our AI reveal patterns you never knew existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" />
            Pattern Recognition
          </Badge>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="w-3 h-3" />
            Trend Analysis
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Lightbulb className="w-3 h-3" />
            Smart Recommendations
          </Badge>
        </div>
      </div>
    </section>
  )
}
