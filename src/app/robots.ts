import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/content";
export default function robots(): MetadataRoute.Robots {
  const agents = ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended"];
  return { rules: agents.map((userAgent) => ({ userAgent, allow: "/" })), sitemap: absoluteUrl("/sitemap.xml"), host: absoluteUrl("/") };
}
