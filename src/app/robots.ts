import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  const agents = ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"];
  return { rules: agents.map((userAgent) => ({ userAgent, allow: "/" })), sitemap: absoluteUrl("/sitemap.xml"), host: absoluteUrl("/") };
}
