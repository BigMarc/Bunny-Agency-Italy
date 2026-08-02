"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MobileNav({ items, applyLabel }: { items: [string, string][]; applyLabel: string }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="mnav">
      <button
        ref={btnRef}
        type="button"
        className="mnav-toggle"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Chiudi il menu" : "Apri il menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`mnav-bars${open ? " is-open" : ""}`} aria-hidden="true"><i /><i /><i /></span>
      </button>
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        className={`mnav-panel${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Menu mobile">
          {items.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link className="mnav-cta" href="/apply" onClick={() => setOpen(false)}>{applyLabel}</Link>
        </nav>
      </div>
      {open && <button className="mnav-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setOpen(false)} />}
    </div>
  );
}
