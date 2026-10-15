import type { APIRoute } from "astro";
import { apps, appPath, isListed } from "../data/apps";
import { getPolicies, getAnnouncements, policyPath, announcementPath, productOf } from "../data/content";

export const GET: APIRoute = async ({ site }) => {
  const listed = new Set(apps.filter(isListed).map((a) => a.slug));
  const pages = [
    "/",
    ...[...listed].map(appPath),
    ...(await getPolicies()).filter((p) => listed.has(productOf(p.id)) && !p.data.draft).map(policyPath),
    ...(await getAnnouncements()).filter((a) => listed.has(productOf(a.id))).map(announcementPath),
  ];
  const urls = pages
    .map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
