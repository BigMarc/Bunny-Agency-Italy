"use client";
import { useEffect, useId, useRef, useState } from "react";

declare global { interface Window { hbspt?: { forms: { create: (options: Record<string, unknown>) => void } }; __bunnyHsPromise?: Promise<void> } }

const loadHubSpot = () => {
  if (window.hbspt) return Promise.resolve();
  if (window.__bunnyHsPromise) return window.__bunnyHsPromise;
  window.__bunnyHsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="js.hsforms.net/forms/embed/v2.js"]') as HTMLScriptElement | null;
    if (existing) { existing.addEventListener("load", () => resolve(), { once: true }); existing.addEventListener("error", reject, { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/embed/v2.js"; script.async = true; script.defer = true;
    script.onload = () => resolve(); script.onerror = reject; document.head.appendChild(script);
  });
  return window.__bunnyHsPromise;
};

export default function TrackedHubSpotForm({ siteCode, category, language, loadLabel }: { siteCode: string; category: string; language: string; loadLabel: string }) {
  const reactId = useId();
  const targetId = "hubspot-" + reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const [enabled, setEnabled] = useState(false);
  const created = useRef(false);
  useEffect(() => {
    if (!enabled || created.current) return;
    let cancelled = false;
    loadHubSpot().then(() => {
      if (cancelled || created.current || !window.hbspt) return;
      const values = () => ({ source_page_url: window.location.origin + window.location.pathname, source_site: siteCode, source_category: category, source_language: language });
      const populate = (formLike: unknown) => {
        const candidate = formLike as { 0?: HTMLFormElement; querySelector?: HTMLFormElement["querySelector"]; appendChild?: HTMLFormElement["appendChild"] };
        const form = (candidate?.[0] || candidate) as HTMLFormElement | undefined;
        if (!form?.querySelector || !form?.appendChild) return;
        Object.entries(values()).forEach(([name, value]) => {
          let input = form.querySelector('input[name="' + name + '"]') as HTMLInputElement | null;
          if (!input) { input = document.createElement("input"); input.type = "hidden"; input.name = name; form.appendChild(input); }
          input.value = value; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true }));
        });
      };
      window.hbspt.forms.create({ portalId: "20396287", formId: "c4228166-c0cf-4215-b4d6-f345254e2225", region: "na1", target: "#" + targetId, onFormReady: populate, onBeforeFormSubmit: populate });
      created.current = true;
    }).catch(() => { created.current = false; });
    return () => { cancelled = true; };
  }, [enabled, targetId, siteCode, category, language]);
  return <div className="tracked-form">{!enabled && <button className="button button-primary" type="button" onClick={() => setEnabled(true)}>{loadLabel}</button>}<div id={targetId} className="hubspot-target" /></div>;
}
