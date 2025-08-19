import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet, BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Upload Dataset",
      description: "Add new data to create visualizations",
      icon: Upload,
      href: "/",
      color: "bg-blue-500",
    },
    {
      title: "Import from URL",
      description: "Connect Google Sheets or APIs",
      icon: FileSpreadsheet,
      href: "/",
      color: "bg-green-500",
    },
    {
      title: "AI Chart Generator",
      description: "Let AI recommend perfect charts",
      icon: Sparkles,
      href: "/dashboard/datasets",
      color: "bg-purple-500",
    },
    {
      title: "Browse Templates",
      description: "Start with pre-built chart types",
      icon: BarChart3,
      href: "/dashboard/charts",
      color: "bg-orange-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
        <CardDescription>Get started with these common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="group hover:shadow-md transition-all cursor-pointer border-dashed hover:border-solid">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
