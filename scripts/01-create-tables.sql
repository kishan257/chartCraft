-- Create tables for the data visualization platform

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_charts_dataset_id ON charts(dataset_id);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at DESC);
