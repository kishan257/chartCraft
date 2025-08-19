-- Create tables for the data visualization platform
-- Fixed version with proper error handling

-- Table to store user datasets
CREATE TABLE IF NOT EXISTS datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  columns JSONB NOT NULL, -- Store column metadata (name, type, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store generated charts
CREATE TABLE IF NOT EXISTS charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES datasets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  chart_type VARCHAR(50) NOT NULL, -- bar, line, pie, scatter, etc.
  config JSONB NOT NULL, -- Chart configuration (colors, axes, etc.)
  ai_insights TEXT, -- AI-generated insights about the chart
  is_public BOOLEAN DEFAULT FALSE, -- For sharing functionality
  share_token VARCHAR(255) UNIQUE, -- For public sharing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_charts_dataset_id ON charts(dataset_id);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_charts_share_token ON charts(share_token) WHERE share_token IS NOT NULL;

-- Insert some sample data for testing
INSERT INTO datasets (name, description, data, columns) VALUES 
(
  'Sample Sales Data',
  'Monthly sales data for demonstration',
  '[
    {"month": "Jan", "sales": 12000, "profit": 3000},
    {"month": "Feb", "sales": 15000, "profit": 4500},
    {"month": "Mar", "sales": 18000, "profit": 5400},
    {"month": "Apr", "sales": 14000, "profit": 4200},
    {"month": "May", "sales": 20000, "profit": 6000}
  ]'::jsonb,
  '[
    {"name": "month", "type": "string", "nullable": false},
    {"name": "sales", "type": "number", "nullable": false},
    {"name": "profit", "type": "number", "nullable": false}
  ]'::jsonb
),
(
  'Website Analytics',
  'Daily website visitor data',
  '[
    {"date": "2024-01-01", "visitors": 1200, "pageviews": 3600, "bounce_rate": 0.35},
    {"date": "2024-01-02", "visitors": 1350, "pageviews": 4050, "bounce_rate": 0.32},
    {"date": "2024-01-03", "visitors": 1100, "pageviews": 3300, "bounce_rate": 0.38},
    {"date": "2024-01-04", "visitors": 1450, "pageviews": 4350, "bounce_rate": 0.30},
    {"date": "2024-01-05", "visitors": 1600, "pageviews": 4800, "bounce_rate": 0.28}
  ]'::jsonb,
  '[
    {"name": "date", "type": "string", "nullable": false},
    {"name": "visitors", "type": "number", "nullable": false},
    {"name": "pageviews", "type": "number", "nullable": false},
    {"name": "bounce_rate", "type": "number", "nullable": false}
  ]'::jsonb
);
