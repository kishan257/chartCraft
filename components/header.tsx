import { Button } from "@/components/ui/button"
import { BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-serif">ChartCraft</h1>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/#gallery" className="text-muted-foreground hover:text-foreground transition-colors">
            Gallery
          </Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/create">
            <Button size="sm" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Start Creating Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
