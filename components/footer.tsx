import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Twitter, Linkedin, Github, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold font-serif">ChartCraft</h3>
            </div>
            <p className="text-muted-foreground">
              AI-powered data visualization platform that turns your data into beautiful, insightful charts in seconds.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Integrations
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Tutorials
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Get the latest updates on new features and data visualization tips.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ChartCraft. All rights reserved. Built with Kishan V Patel for data professionals.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
