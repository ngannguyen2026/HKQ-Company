import type { APIRoute } from "astro";
import { apps, appPath } from "../data/apps";
import { getPolicies, getAnnouncements, policyPath, announcementPath } from "../data/content";

export const GET: APIRoute = async ({ site }) => {
  const pages = [
    "/",
    ...apps.map((a) => appPath(a.slug)),
    ...(await getPolicies()).map(policyPath),
    ...(await getAnnouncements()).map(announcementPath),
  ];
  const urls = pages
    .map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
