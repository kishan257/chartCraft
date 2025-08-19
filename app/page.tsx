import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { DataUpload } from "@/components/data-upload"
import { ChartGallery } from "@/components/chart-gallery"
import { AIInsights } from "@/components/ai-insights"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div className="container mx-auto px-4 py-16 space-y-20">
          <section id="features">
            <DataUpload />
          </section>
          <section id="gallery">
            <ChartGallery />
          </section>
          <AIInsights />
        </div>
      </main>
      <Footer />
    </div>
  )
}
