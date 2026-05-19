import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

const SITE_URL = "https://samaxon.site";

async function generateSitemap() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("Supabase URL or Key not found. Skipping dynamic sitemap generation.");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  
  const urls = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/about", changefreq: "monthly", priority: "0.8" },
    { loc: "/projects", changefreq: "weekly", priority: "0.9" },
    { loc: "/quests", changefreq: "weekly", priority: "0.9" },
    { loc: "/contact", changefreq: "monthly", priority: "0.7" }
  ];

  try {
    // Fetch Projects
    const { data: projects } = await supabase.from("projects").select("id, updated_at");
    if (projects) {
      projects.forEach((row) => {
        urls.push({
          loc: `/projects/${row.id}`,
          changefreq: "monthly",
          priority: "0.8",
          lastmod: new Date(row.updated_at || Date.now()).toISOString()
        });
      });
    }

    // Fetch Blogs / Quests
    const { data: blogs } = await supabase.from("blogs").select("slug, id, updated_at").eq('status', 'published');
    if (blogs) {
      blogs.forEach((row) => {
        urls.push({
          loc: `/blog/${row.slug || row.id}`,
          changefreq: "monthly",
          priority: "0.8",
          lastmod: new Date(row.updated_at || Date.now()).toISOString()
        });
      });
    }

  } catch (error) {
    console.error("Error fetching dynamic data for sitemap:", error);
  }

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const publicDir = path.resolve(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXML, "utf8");
  console.log("Sitemap generated at public/sitemap.xml");

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");
  console.log("robots.txt generated at public/robots.txt");
}

generateSitemap();
