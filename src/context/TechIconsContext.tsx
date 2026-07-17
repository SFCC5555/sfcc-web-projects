import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const TechIconsContext = createContext<Record<string, string>>({});

function TechIconsProvider({ children }: { children: React.ReactNode }) {
  const [techIcons, setTechIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("technologies").select("name, icon_url").order("sort_order").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((t: { name: string; icon_url: string | null }) => { map[t.name] = t.icon_url ?? ""; });
        setTechIcons(map);
      }
    });
  }, []);

  return <TechIconsContext.Provider value={techIcons}>{children}</TechIconsContext.Provider>;
}

function useTechIcons() {
  return useContext(TechIconsContext);
}

export { TechIconsProvider, useTechIcons };
