"use client";
import { useEffect } from "react";
export default function LegacyHashBridge() {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, "/");
    if (hash !== "/" && hash.startsWith("/")) window.location.replace(hash);
  }, []);
  return null;
}
