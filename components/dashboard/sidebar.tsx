"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, Database, PieChart, Plus, Settings, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Datasets", href: "/dashboard/datasets", icon: Database },
  { name: "Charts", href: "/dashboard/charts", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold font-serif">ChartCraft</h1>
        </Link>

        <Link href="/create">
          <Button className="w-full gap-2 mb-6">
            <Plus className="w-4 h-4" />
            Create Chart
          </Button>
        </Link>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start gap-3", isActive && "bg-secondary")}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
