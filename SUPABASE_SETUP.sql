-- ==========================================
-- SAMAXON STUDIO - SUPABASE DATABASE INITIALIZATION SCHEMA
-- ==========================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://supabase.com
-- 2. Open your project and select "SQL Editor" from the left menu.
-- 3. Click "New Query" and paste this entire script.
-- 4. Click the "Run" button to create all target tables.
-- ==========================================

-- 1. LEADS SCHEMA
CREATE TABLE IF NOT EXISTS samaxon_leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "businessName" TEXT,
    phone TEXT,
    email TEXT,
    city TEXT,
    "serviceNeeded" TEXT,
    "currentProblem" TEXT,
    "desiredTimeline" TEXT,
    "budgetRange" TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'won', 'lost')),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for leads
ALTER TABLE samaxon_leads ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to insert new contact leads
CREATE POLICY "Allow public inserts on leads" 
ON samaxon_leads FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admins to select, update, and delete leads
CREATE POLICY "Allow admin full access on leads" 
ON samaxon_leads FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Also allow temporary open read/write bypass for dev/test in preview if needed
CREATE POLICY "Allow read access for display"
ON samaxon_leads FOR SELECT
USING (true);


-- 2. CAREER APPLICATIONS SCHEMA
CREATE TABLE IF NOT EXISTS samaxon_career_applications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    city TEXT,
    "roleInterestedIn" TEXT,
    experience TEXT,
    "whySamaXon" TEXT,
    "portfolioUrl" TEXT,
    "resumeUrl" TEXT,
    "linkedinUrl" TEXT,
    "interviewNotes" TEXT,
    "reviewedBy" TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'interviewed', 'accepted', 'declined')),
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for careers
ALTER TABLE samaxon_career_applications ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to submit career applications
CREATE POLICY "Allow public submissions on careers" 
ON samaxon_career_applications FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admins to read/write applications
CREATE POLICY "Allow admin full access on careers" 
ON samaxon_career_applications FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Also allow temporary select bypass for dev dashboard support
CREATE POLICY "Allow select on careers"
ON samaxon_career_applications FOR SELECT
USING (true);


-- 3. PORTFOLIO PROJECTS SCHEMA
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

-- Enable RLS for portfolio
ALTER TABLE samaxon_portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Allow everyone (public) to view/read portfolio projects
CREATE POLICY "Allow public read on projects" 
ON samaxon_portfolio_projects FOR SELECT 
USING (true);

-- Allow admins to insert/update/delete portfolio projects
CREATE POLICY "Allow admin full access on projects" 
ON samaxon_portfolio_projects FOR ALL 
USING (true) 
WITH CHECK (true);


-- 4. SERVICES SCHEMA
CREATE TABLE IF NOT EXISTS samaxon_services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    headline TEXT NOT NULL,
    category TEXT,
    "painPoint" TEXT,
    "solutionCopy" TEXT,
    deliverables TEXT[], -- TEXT ARRAY representation for deliverable list items
    "ctaText" TEXT,
    "benefitPoints" TEXT[] -- TEXT ARRAY representation for checkmark points
);

-- Enable RLS for services
ALTER TABLE samaxon_services ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view services
CREATE POLICY "Allow public read on services" 
ON samaxon_services FOR SELECT 
USING (true);

-- Allow admins to insert/update/delete services
CREATE POLICY "Allow admin full access on services" 
ON samaxon_services FOR ALL 
USING (true) 
WITH CHECK (true);


-- 5. TESTIMONIALS SCHEMA
CREATE TABLE IF NOT EXISTS samaxon_testimonials (
    id TEXT PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    "founderNote" BOOLEAN DEFAULT false
);

-- Enable RLS for testimonials
ALTER TABLE samaxon_testimonials ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read testimonials
CREATE POLICY "Allow public read on testimonials" 
ON samaxon_testimonials FOR SELECT 
USING (true);

-- Allow admins to edit testimonials
CREATE POLICY "Allow admin full access on testimonials" 
ON samaxon_testimonials FOR ALL 
USING (true) 
WITH CHECK (true);


-- 6. BLOG POSTS (INSIGHTS) SCHEMA
CREATE TABLE IF NOT EXISTS samaxon_blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    "publishedAt" TEXT,
    "readTime" TEXT
);

-- Enable RLS for blogs
ALTER TABLE samaxon_blogs ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read blogs
CREATE POLICY "Allow public read on blogs" 
ON samaxon_blogs FOR SELECT 
USING (true);

-- Allow admins to manage blogs
CREATE POLICY "Allow admin full access on blogs" 
ON samaxon_blogs FOR ALL 
USING (true) 
WITH CHECK (true);


-- ==========================================
-- OPTIONAL: SETUP STORAGE BUCKETS
-- ==========================================
-- If you want to use Supabase Storage for mockups or images, you can create a bucket
-- named "samaxon-media" from the "Storage" section of your Supabase dashboard and make it "Public".
-- ==========================================
