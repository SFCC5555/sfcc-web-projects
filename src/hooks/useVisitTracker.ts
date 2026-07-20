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

export function useVisitTracker() {
  useEffect(() => {
    const visitorId = getOrCreateVisitorId();
    supabase.from("visits").insert({ visitor_id: visitorId }).then();
  }, []);
}
