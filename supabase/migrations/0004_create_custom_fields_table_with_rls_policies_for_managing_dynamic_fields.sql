CREATE TABLE public.custom_fields (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- e.g., 'text', 'textarea', 'select', 'number', 'date', 'checkbox'
  entity_type TEXT NOT NULL, -- e.g., 'job', 'service', 'freelancer_profile', 'employer_profile', 'project'
  is_required BOOLEAN DEFAULT FALSE,
  options JSONB, -- For select/radio types, e.g., ['Option 1', 'Option 2']
  default_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;

-- Policies for custom_fields
-- SELECT policy: Authenticated users can view field definitions
CREATE POLICY "Authenticated users can view custom fields" ON public.custom_fields
FOR SELECT TO authenticated USING (true);

-- INSERT policy: Only admins can insert new custom fields
CREATE POLICY "Admins can insert custom fields" ON public.custom_fields
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- UPDATE policy: Only admins can update custom fields
CREATE POLICY "Admins can update custom fields" ON public.custom_fields
FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);

-- DELETE policy: Only admins can delete custom fields
CREATE POLICY "Admins can delete custom fields" ON public.custom_fields
FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin')
);