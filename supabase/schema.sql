-- ==============================================================================
-- ZYRO STUDIOS // SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
  live_url TEXT,
  year INTEGER NOT NULL DEFAULT 2026,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'in-development', 'archived')),
  problem_statement TEXT,
  solution TEXT,
  results TEXT,
  client TEXT
);

-- 3. Inquiries Table (Direct Contact Submissions)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  project_type TEXT NOT NULL,
  timeline TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_review', 'contacted', 'archived')),
  notes TEXT
);

-- 4. Admin Users Table (For Secure Multi-Admin Management)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'superadmin' CHECK (role IN ('superadmin', 'admin', 'viewer'))
);

-- 5. Indexes for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);

-- 6. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 8. RLS Policies
-- Projects: Anyone can view published projects
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO public, anon, authenticated
  USING (status != 'archived');

-- Projects: Full access for postgres & service role / admin backend
CREATE POLICY "Admin full access projects"
  ON public.projects FOR ALL
  TO postgres, service_role
  USING (true)
  WITH CHECK (true);

-- Inquiries: Anyone can insert an inquiry from the website contact form
CREATE POLICY "Public can insert inquiries"
  ON public.inquiries FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);

-- Inquiries: Only postgres & service role / admin can view or manage leads
CREATE POLICY "Admin full access inquiries"
  ON public.inquiries FOR ALL
  TO postgres, service_role
  USING (true)
  WITH CHECK (true);

-- Admin Users: Completely private to postgres & service role
CREATE POLICY "Admin full access admin_users"
  ON public.admin_users FOR ALL
  TO postgres, service_role
  USING (true)
  WITH CHECK (true);

-- 9. Storage Bucket Setup (Run in SQL Editor if bucket doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Public Read Access for project assets
CREATE POLICY "Public Read Project Assets"
  ON storage.objects FOR SELECT
  TO public, anon, authenticated
  USING (bucket_id = 'project-assets');

-- Storage Policy: Service Role / Admin Upload & Management ONLY (Prevents public uploads)
CREATE POLICY "Service Role Upload Project Assets"
  ON storage.objects FOR ALL
  TO service_role, postgres
  USING (bucket_id = 'project-assets')
  WITH CHECK (bucket_id = 'project-assets');
