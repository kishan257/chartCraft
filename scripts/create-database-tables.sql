-- Create datasets table with proper column names
CREATE TABLE IF NOT EXISTS public.datasets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  columns JSONB NOT NULL,
  row_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create charts table with proper column names
CREATE TABLE IF NOT EXISTS public.charts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES public.datasets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB NOT NULL,
  ai_insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_datasets_created_at ON public.datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_charts_dataset_id ON public.charts(dataset_id);
CREATE INDEX IF NOT EXISTS idx_charts_created_at ON public.charts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since no auth required)
CREATE POLICY IF NOT EXISTS "Allow all operations on datasets" ON public.datasets FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on charts" ON public.charts FOR ALL USING (true);

-- Insert sample data for immediate testing
INSERT INTO public.datasets (name, description, data, columns, row_count) VALUES 
(
  'Sample Sales Data',
  'Monthly sales data for demonstration',
  '[{"month":"Jan","sales":12000,"profit":3000},{"month":"Feb","sales":15000,"profit":4500},{"month":"Mar","sales":18000,"profit":5400},{"month":"Apr","sales":14000,"profit":4200},{"month":"May","sales":20000,"profit":6000}]'::jsonb,
  '[{"name":"month","type":"text","displayName":"Month"},{"name":"sales","type":"integer","displayName":"Sales"},{"name":"profit","type":"integer","displayName":"Profit"}]'::jsonb,
  5
) ON CONFLICT DO NOTHING;
