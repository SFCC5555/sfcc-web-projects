import { useEffect } from "react";
import { supabase } from "../lib/supabase";

function getOrCreateVisitorId(): string {
  const key = "sfcc_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

async function fetchGeo(): Promise<{ country: string | null; city: string | null }> {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    return {
      country: data.country ?? null,
      city: data.city ?? null,
    };
  } catch {
    return { country: null, city: null };
  }
}

export function useVisitTracker() {
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    fetchGeo().then(({ country, city }) => {
      supabase
        .from("visits")
        .insert({ visitor_id: visitorId, country, city })
        .then(({ error }) => { if (error) console.error("visits:", error); });
    });
  }, []);
}
