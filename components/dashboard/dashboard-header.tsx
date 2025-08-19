"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Search, Plus, Bell, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Overview", active: pathname === "/dashboard" },
    { href: "/dashboard/datasets", label: "Datasets", active: pathname === "/dashboard/datasets" },
    { href: "/dashboard/charts", label: "Charts", active: pathname === "/dashboard/charts" },
  ]

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-serif">ChartCraft</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  item.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search datasets, charts..." className="pl-10 w-64" />
            </div>

            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Dataset</span>
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
