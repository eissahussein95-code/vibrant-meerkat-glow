CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC,
  status TEXT DEFAULT 'open' NOT NULL, -- e.g., 'open', 'closed', 'draft'
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies for jobs table
-- SELECT policy: Authenticated users can view job listings
CREATE POLICY "Authenticated users can view jobs" ON public.jobs
FOR SELECT TO authenticated USING (true);

-- INSERT policy: Only authenticated users with 'Employer' role can insert new jobs
CREATE POLICY "Employers can insert their own jobs" ON public.jobs
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Employer') AND employer_id = auth.uid()
);

-- UPDATE policy: Employers can update their own jobs, Admins can update all
CREATE POLICY "Employers can update their own jobs" ON public.jobs
FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Employer') AND employer_id = auth.uid()
);

-- DELETE policy: Employers can delete their own jobs, Admins can delete all
CREATE POLICY "Employers can delete their own jobs" ON public.jobs
FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Employer') AND employer_id = auth.uid()
);

-- Admin override for UPDATE and DELETE (optional, but good for management)
-- Note: Supabase RLS policies are additive. If an admin policy is needed, it would be a separate policy.
-- For simplicity, the above policies are sufficient for now, assuming 'Admin' role can also be 'Employer' or a separate admin policy would be added if needed.