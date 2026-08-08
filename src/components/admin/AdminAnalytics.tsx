import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminAnalytics.scss";

interface DayStat { day: string; count: number }
interface ProjectStat { project_name: string; clicks: number }
interface VisitorStat { visitor_id: string; visits: number; lastVisit: string; country: string | null; city: string | null; projects: string[]; isKnown: boolean }

const TZ = "America/Guayaquil";

function toECTDay(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
}

function formatECT(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    timeZone: TZ,
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(iso));
}

function AdminAnalytics() {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);
  const [visitsByDay, setVisitsByDay] = useState<DayStat[]>([]);
  const [projectClicks, setProjectClicks] = useState<ProjectStat[]>([]);
  const [visitors, setVisitors] = useState<VisitorStat[]>([]);
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ visitor_id: string; isKnown: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setExpandedVisitor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function load() {
    const [visitsRes, clicksRes, knownRes] = await Promise.all([
      supabase.from("visits").select("visitor_id, visited_at, country, city"),
      supabase.from("project_clicks").select("project_name, visitor_id, clicked_at"),
      supabase.from("known_visitors").select("visitor_id"),
    ]);

    const knownSet = new Set((knownRes.data ?? []).map(k => k.visitor_id));

    if (visitsRes.data) {
      setTotalVisits(visitsRes.data.length);

      const visitCountByVisitor: Record<string, number> = {};
      const lastVisitByVisitor: Record<string, string> = {};
      const locationByVisitor: Record<string, { country: string | null; city: string | null }> = {};
      visitsRes.data.forEach(v => {
        visitCountByVisitor[v.visitor_id] = (visitCountByVisitor[v.visitor_id] ?? 0) + 1;
        if (!lastVisitByVisitor[v.visitor_id] || v.visited_at > lastVisitByVisitor[v.visitor_id]) {
          lastVisitByVisitor[v.visitor_id] = v.visited_at;
        }
        if (!locationByVisitor[v.visitor_id] && (v.country || v.city)) {
          locationByVisitor[v.visitor_id] = { country: v.country, city: v.city };
        }
      });
      setUniqueVisitors(Object.keys(visitCountByVisitor).length);

      const byDay: Record<string, number> = {};
      visitsRes.data.forEach(v => {
        const day = toECTDay(v.visited_at);
        byDay[day] = (byDay[day] ?? 0) + 1;
      });
      setVisitsByDay(
        Object.entries(byDay)
          .map(([day, count]) => ({ day, count }))
          .sort((a, b) => b.day.localeCompare(a.day))
          .slice(0, 14)
      );

      const projectsByVisitor: Record<string, Set<string>> = {};
      if (clicksRes.data) {
        const byProject: Record<string, number> = {};
        clicksRes.data.forEach(c => {
          byProject[c.project_name] = (byProject[c.project_name] ?? 0) + 1;
          if (!c.visitor_id) return;
          if (!projectsByVisitor[c.visitor_id]) projectsByVisitor[c.visitor_id] = new Set();
          projectsByVisitor[c.visitor_id].add(c.project_name);
        });
        setProjectClicks(
          Object.entries(byProject)
            .map(([project_name, clicks]) => ({ project_name, clicks }))
            .sort((a, b) => b.clicks - a.clicks)
        );
      }

      setVisitors(
        Object.entries(visitCountByVisitor)
          .map(([visitor_id, visits]) => ({
            visitor_id,
            visits,
            lastVisit: lastVisitByVisitor[visitor_id],
            country: locationByVisitor[visitor_id]?.country ?? null,
            city: locationByVisitor[visitor_id]?.city ?? null,
            projects: Array.from(projectsByVisitor[visitor_id] ?? []),
            isKnown: knownSet.has(visitor_id),
          }))
          .sort((a, b) => b.lastVisit.localeCompare(a.lastVisit))
      );
    }

    setLoading(false);
  }

  async function confirmToggle() {
    if (!confirm) return;
    const { visitor_id, isKnown } = confirm;
    if (isKnown) {
      await supabase.from("known_visitors").delete().eq("visitor_id", visitor_id);
    } else {
      await supabase.from("known_visitors").insert({ visitor_id });
    }
    setVisitors(prev => prev.map(v =>
      v.visitor_id === visitor_id ? { ...v, isKnown: !isKnown } : v
    ));
    setConfirm(null);
  }

  if (loading) return <div className="crudLoading">Loading…</div>;

  return (
    <div className="analyticsGrid">

      <div className="analyticsCard">
        <span className="analyticsLabel">Total visits</span>
        <span className="analyticsValue">{totalVisits ?? 0}</span>
      </div>

      <div className="analyticsCard">
        <span className="analyticsLabel">Unique visitors</span>
        <span className="analyticsValue">{uniqueVisitors ?? 0}</span>
      </div>

      <div className="analyticsCard analyticsCard--wide">
        <span className="analyticsLabel">Visits — last 14 days</span>
        {visitsByDay.length === 0 ? (
          <p className="analyticsEmpty">No data yet</p>
        ) : (
          <table className="analyticsTable">
            <thead>
              <tr><th>Date</th><th>Visits</th></tr>
            </thead>
            <tbody>
              {visitsByDay.map(({ day, count }) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="analyticsCard analyticsCard--wide">
        <span className="analyticsLabel">Project opens</span>
        {projectClicks.length === 0 ? (
          <p className="analyticsEmpty">No data yet</p>
        ) : (
          <ol className="analyticsProjectList">
            {projectClicks.map(({ project_name, clicks }, i) => (
              <li key={project_name} className="analyticsProjectItem">
                <span className="analyticsProjectRank">{i + 1}.</span>
                <span className="analyticsProjectName">{project_name}</span>
                <span className="analyticsProjectCount">{clicks} {clicks === 1 ? "open" : "opens"}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="analyticsCard analyticsCard--wide">
        <span className="analyticsLabel">Visitors</span>
        {visitors.length === 0 ? (
          <p className="analyticsEmpty">No data yet</p>
        ) : (
          <div className="analyticsTableScroll">
            <table className="analyticsTable">
              <thead>
                <tr><th>Visitor</th><th>Location</th><th>Last visit</th><th>Visits</th><th>Projects opened</th><th></th></tr>
              </thead>
              <tbody>
                {visitors.map(({ visitor_id, visits, lastVisit, country, city, projects, isKnown }) => {
                  const short = visitor_id.slice(0, 8);
                  const location = [city, country].filter(Boolean).join(", ") || "—";
                  return (
                    <tr key={visitor_id} className={isKnown ? "analyticsRow--known" : ""}>
                      <td className="analyticsVisitorId">{short}…</td>
                      <td>{location}</td>
                      <td className="analyticsLastVisit">{formatECT(lastVisit)}</td>
                      <td>{visits}</td>
                      <td>
                        {projects.length === 0 ? (
                          <span className="analyticsNone">—</span>
                        ) : (
                          <div className="analyticsVisitorProjectsCell">
                            <span
                              className="analyticsProjectToggle"
                              onClick={() => setExpandedVisitor(expandedVisitor === visitor_id ? null : visitor_id)}
                            >
                              {projects.length} {projects.length === 1 ? "project" : "projects"}
                              <span className="analyticsToggleIcon">{expandedVisitor === visitor_id ? " ▴" : " ▾"}</span>
                            </span>
                            {expandedVisitor === visitor_id && (
                              <div className="analyticsPopover" ref={popoverRef}>
                                <ul className="analyticsVisitorProjects">
                                  {projects.map(p => <li key={p}>{p}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          className={`analyticsKnownBtn${isKnown ? " analyticsKnownBtn--active" : ""}`}
                          onClick={() => setConfirm({ visitor_id, isKnown })}
                        >
                          {isKnown ? "Known" : "Mark"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <div className="analyticsModalOverlay" onClick={() => setConfirm(null)}>
          <div className="analyticsModal" onClick={e => e.stopPropagation()}>
            <p className="analyticsModalText">
              {confirm.isKnown
                ? "Remove this visitor from known?"
                : "Mark this visitor as known?"}
            </p>
            <div className="analyticsModalActions">
              <button className="analyticsModalCancel" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="analyticsModalConfirm" onClick={confirmToggle}>Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export { AdminAnalytics };
