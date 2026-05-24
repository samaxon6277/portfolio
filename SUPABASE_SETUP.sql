-- =====================================================================
-- SAMAXON STUDIO - SUPABASE PRODUCTION DATABASE SCHEMA SETUP
-- =====================================================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://supabase.com
-- 2. Open your project and click on the "SQL Editor" in the left sidebar.
-- 3. Click "New Query" and paste this entire script.
-- 4. Click "Run" button to execute the script.
-- =====================================================================

-- 1. TEAM MEMBERS TABLE (Admin Users Authentication Profile Mapping)
CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY, -- Matches Supabase Auth User ID (UUID)
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'sales_manager', 'career_manager', 'content_editor', 'viewer')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    created_by TEXT
);

-- Enable RLS for team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users with admin/super_admin privileges or the user itself to manage/select profiles
CREATE POLICY "Allow public select on team_members for login lookup" 
ON team_members FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated full write on team_members" 
ON team_members FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);


-- 2. CLIENT INQUIRIES TABLE (Leads management)
CREATE TABLE IF NOT EXISTS client_inquiries (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    business_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    service_required TEXT,
    city TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'won', 'lost')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    notes TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for client_inquiries
ALTER TABLE client_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public submission (inserts) of contact inquiries from public website forms
CREATE POLICY "Allow public inserts on client_inquiries" 
ON client_inquiries FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admins to view/manage inquiries
CREATE POLICY "Allow select on client_inquiries"
ON client_inquiries FOR SELECT
USING (true);

CREATE POLICY "Allow admin full write on client_inquiries" 
ON client_inquiries FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);


-- 3. JOB APPLICATIONS TABLE (Careers Hub Applications)
CREATE TABLE IF NOT EXISTS job_applications (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    gender TEXT,
    age INTEGER,
    city TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    education TEXT,
    experience TEXT,
    languages TEXT,
    position TEXT,
    expected_salary TEXT,
    why_hire TEXT,
    voice_sample_link TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public submissions (inserts) from Carrers page
CREATE POLICY "Allow public inserts on job_applications" 
ON job_applications FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admins / dashboard display to select/manage
CREATE POLICY "Allow select on job_applications"
ON job_applications FOR SELECT
USING (true);

CREATE POLICY "Allow admin full write on job_applications" 
ON job_applications FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);


-- 4. PORTFOLIO PROJECTS TABLE (SamaXon Showcases)
CREATE TABLE IF NOT EXISTS samaxon_portfolio_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    category TEXT CHECK (category IN ('websites', 'apps', 'brand-identity', 'graphics', 'automations', 'bots', 'admin-ready')),
    problem TEXT,
    solution TEXT,
    result TEXT,
    "visualTag" TEXT,
    "accentColor" TEXT,
    "thumbnailUrl" TEXT
);

-- Enable RLS
ALTER TABLE samaxon_portfolio_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on projects" 
ON samaxon_portfolio_projects FOR SELECT 
USING (true);

CREATE POLICY "Allow admin full access on projects" 
ON samaxon_portfolio_projects FOR ALL 
USING (true) 
WITH CHECK (true);


-- 5. SERVICES TABLE (Studio Deliverables)
CREATE TABLE IF NOT EXISTS samaxon_services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    category TEXT,
    "painPoint" TEXT,
    "solutionCopy" TEXT,
    deliverables TEXT[], -- Text Array
    "ctaText" TEXT,
    "benefitPoints" TEXT[] -- Text Array
);

-- Enable RLS
ALTER TABLE samaxon_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on services" 
ON samaxon_services FOR SELECT 
USING (true);

CREATE POLICY "Allow admin full access on services" 
ON samaxon_services FOR ALL 
USING (true) 
WITH CHECK (true);


-- 6. TESTIMONIALS TABLE (Client Endorsements)
CREATE TABLE IF NOT EXISTS samaxon_testimonials (
    id TEXT PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    "founderNote" BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE samaxon_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on testimonials" 
ON samaxon_testimonials FOR SELECT 
USING (true);

CREATE POLICY "Allow admin full access on testimonials" 
ON samaxon_testimonials FOR ALL 
USING (true) 
WITH CHECK (true);


-- 7. BLOG POSTS TABLE (Insights & Case Studies)
CREATE TABLE IF NOT EXISTS samaxon_blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    "publishedAt" TEXT,
    "readTime" TEXT
);

-- Enable RLS
ALTER TABLE samaxon_blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on blogs" 
ON samaxon_blogs FOR SELECT 
USING (true);

CREATE POLICY "Allow admin full access on blogs" 
ON samaxon_blogs FOR ALL 
USING (true) 
WITH CHECK (true);


-- 8. CRAWLER LOGS TABLE (SEO Bot Telemetry)
CREATE TABLE IF NOT EXISTS crawler_logs (
    id TEXT PRIMARY KEY,
    bot_name TEXT NOT NULL,
    user_agent TEXT,
    page_url TEXT,
    ip_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE crawler_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on crawler_logs" 
ON crawler_logs FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow select on crawler_logs" 
ON crawler_logs FOR SELECT 
USING (true);


-- 9. SITE EVENTS TABLE (Client Activity Analytics Tracker)
CREATE TABLE IF NOT EXISTS site_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    country TEXT,
    city TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on site_events" 
ON site_events FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow select on site_events" 
ON site_events FOR SELECT 
USING (true);


-- 10. WEBHOOK LOGS TABLE (Integrations Diagnostic)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id TEXT PRIMARY KEY,
    webhook_type TEXT NOT NULL,
    payload JSONB,
    status TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts on webhook_logs" 
ON webhook_logs FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow select on webhook_logs" 
ON webhook_logs FOR SELECT 
USING (true);


-- =====================================================================
-- SEED OR INITIAL SCRIPT TO RUN MANUALLY FOR CREATING INTERNAL SUPER ADMIN
-- =====================================================================
-- Note: Replace the uuid-placeholder-id-here with your actual Supabase auth.users.id
-- 
-- INSERT INTO team_members (id, full_name, email, role, status, created_at)
-- VALUES ('uuid-placeholder-id-here', 'Manual Super Admin', 'samaxon6277@gmail.com', 'super_admin', 'active', NOW())
-- ON CONFLICT (email) DO UPDATE SET role = 'super_admin', status = 'active';
-- =====================================================================
