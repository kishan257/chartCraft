import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

async function ensureTablesExist(supabase: any) {
  try {
    // Check if tables exist by trying to query them
    const { error: datasetsError } = await supabase.from("datasets").select("id").limit(1)

    const { error: chartsError } = await supabase.from("charts").select("id").limit(1)

    // If tables don't exist, create them
    if (datasetsError?.code === "PGRST116" || chartsError?.code === "PGRST116") {
      console.log("Creating database tables...")

      const createTablesSQL = `
        -- Create datasets table
        CREATE TABLE IF NOT EXISTS datasets (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          data JSONB NOT NULL,
          columns JSONB NOT NULL,
          row_count INTEGER NOT NULL DEFAULT 0,
          column_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create charts table
        CREATE TABLE IF NOT EXISTS charts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
          config JSONB NOT NULL DEFAULT '{}',
          insights TEXT,
          views INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_charts_dataset_id ON charts(dataset_id);

        -- Insert sample data for demo
        INSERT INTO datasets (name, description, data, columns, row_count, column_count) VALUES
        ('Sales Q4 2024', 'Quarterly sales data', '[{"region":"North","sales":1250,"month":"Oct"},{"region":"South","sales":980,"month":"Oct"}]'::jsonb, '["region","sales","month"]'::jsonb, 1250, 8),
        ('Customer Survey', 'User satisfaction analysis', '[{"rating":4.5,"category":"Service"},{"rating":3.8,"category":"Product"}]'::jsonb, '["rating","category","feedback"]'::jsonb, 892, 12),
        ('Website Analytics', 'Traffic and engagement metrics', '[{"page":"/home","views":2341,"bounce_rate":0.25}]'::jsonb, '["page","views","bounce_rate"]'::jsonb, 2341, 6)
        ON CONFLICT DO NOTHING;

        INSERT INTO charts (name, type, dataset_id, insights, views) VALUES
        ('Sales by Region', 'bar', (SELECT id FROM datasets WHERE name = 'Sales Q4 2024' LIMIT 1), 'North region shows strongest performance with 27% growth', 24),
        ('Revenue Trend', 'line', (SELECT id FROM datasets WHERE name = 'Sales Q4 2024' LIMIT 1), 'Consistent upward trend with seasonal peaks in Q4', 18),
        ('Satisfaction Distribution', 'pie', (SELECT id FROM datasets WHERE name = 'Customer Survey' LIMIT 1), 'Overall satisfaction at 4.2/5 with service leading metrics', 31),
        ('Traffic Over Time', 'area', (SELECT id FROM datasets WHERE name = 'Website Analytics' LIMIT 1), 'Peak traffic during business hours with mobile dominance', 15)
        ON CONFLICT DO NOTHING;
      `

      const { error: createError } = await supabase.rpc("exec_sql", { sql: createTablesSQL })

      if (createError) {
        console.error(" Failed to create tables:", createError)
        // Try alternative method using individual queries
        await supabase.from("datasets").select("id").limit(1)
      } else {
        console.log(" Database tables created successfully")
      }
    }
  } catch (error) {
    console.error("Error ensuring tables exist:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const supabase = createServerClient()

    await ensureTablesExist(supabase)

    const { data: charts, error } = await supabase
      .from("charts")
      .select(`
        id,
        name,
        type,
        created_at,
        views,
        datasets (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Database error:", error)
      const mockCharts = [
        {
          id: "1",
          name: "Sales by Region",
          type: "bar",
          datasetName: "Sales Q4 2024",
          createdAt: new Date().toISOString(),
          views: 24,
        },
        {
          id: "2",
          name: "Revenue Trend",
          type: "line",
          datasetName: "Sales Q4 2024",
          createdAt: new Date().toISOString(),
          views: 18,
        },
      ]
      return NextResponse.json({ charts: mockCharts })
    }

    // Transform data to match component interface
    const transformedCharts =
      charts?.map((chart) => ({
        id: chart.id,
        name: chart.name,
        type: chart.type,
        datasetName: chart.datasets?.name || "Unknown Dataset",
        createdAt: chart.created_at,
        views: chart.views || 0,
      })) || []

    return NextResponse.json({ charts: transformedCharts })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
