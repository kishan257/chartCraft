import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-primary/5 py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            AI-Powered Data Visualization Platform
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif tracking-tight animate-fade-in-up">
            Turn Your Data Into
            <span className="block text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Beautiful Stories
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up delay-200">
            Create stunning charts and graphs in seconds with AI assistance. No design experience needed - just upload
            your data and let our AI suggest the perfect visualization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 group hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-lg px-8 py-6 bg-transparent group hover:scale-105 transition-transform"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-8 animate-fade-in-up delay-500">
            <Badge variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              No credit card required
            </Badge>
            <Badge variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              80% faster than traditional tools
            </Badge>
            <Badge variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              AI-powered insights
            </Badge>
          </div>

          {/* Social Proof */}
          <div className="pt-12 animate-fade-in-up delay-700">
            <p className="text-sm text-muted-foreground mb-6">Trusted by data professionals worldwide</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-muted-foreground">10K+</div>
              <div className="text-2xl font-bold text-muted-foreground">Charts Created</div>
              <div className="text-2xl font-bold text-muted-foreground">50+</div>
              <div className="text-2xl font-bold text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
