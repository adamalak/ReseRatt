#!/usr/bin/env node
/**
 * Skickar alla statiska URL:er från out/sitemap.xml till IndexNow (Bing, DuckDuckGo, ChatGPT Search).
 * Körs efter deploy till Cloudflare: `node scripts/ping-indexnow.mjs`
 */
import fs from "node:fs";
import path from "node:path";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://reseratt.bnms.workers.dev").replace(
  /\/+$/,
  ""
);
const key = "reseratt-2026-indexnow-sv";
const host = new URL(siteUrl).host;
const keyLocation = `${siteUrl}/${key}.txt`;

const sitemapPath = path.join(process.cwd(), "out", "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.error("Hittade ingen out/sitemap.xml. Kör `npm run build` först.");
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, "utf8");
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

if (urls.length === 0) {
  console.error("Inga URL:er hittades i sitemap.xml.");
  process.exit(1);
}

const payload = {
  host,
  key,
  keyLocation,
  urlList: urls,
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

console.log(`IndexNow svar: HTTP ${res.status} för ${urls.length} URL:er (${host})`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}
