import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminAnalytics.scss";

interface DayStat { day: string; count: number }
interface ProjectStat { project_name: string; clicks: number }
interface VisitorStat { visitor_id: string; visits: number; projects: string[] }

function AdminAnalytics() {
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);
  const [visitsByDay, setVisitsByDay] = useState<DayStat[]>([]);
  const [projectClicks, setProjectClicks] = useState<ProjectStat[]>([]);
  const [visitors, setVisitors] = useState<VisitorStat[]>([]);
  const [expandedVisitor, setExpandedVisitor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const [visitsRes, clicksRes] = await Promise.all([
      supabase.from("visits").select("visitor_id, visited_at"),
      supabase.from("project_clicks").select("project_name, visitor_id, clicked_at"),
    ]);

    if (visitsRes.data) {
      setTotalVisits(visitsRes.data.length);

      const visitCountByVisitor: Record<string, number> = {};
      visitsRes.data.forEach(v => {
        visitCountByVisitor[v.visitor_id] = (visitCountByVisitor[v.visitor_id] ?? 0) + 1;
      });
      setUniqueVisitors(Object.keys(visitCountByVisitor).length);

      const byDay: Record<string, number> = {};
      visitsRes.data.forEach(v => {
        const day = v.visited_at.slice(0, 10);
        byDay[day] = (byDay[day] ?? 0) + 1;
      });
      setVisitsByDay(
        Object.entries(byDay)
          .map(([day, count]) => ({ day, count }))
          .sort((a, b) => b.day.localeCompare(a.day))
          .slice(0, 14)
      );

      if (clicksRes.data) {
        const projectsByVisitor: Record<string, Set<string>> = {};
        clicksRes.data.forEach(c => {
          if (!c.visitor_id) return;
          if (!projectsByVisitor[c.visitor_id]) projectsByVisitor[c.visitor_id] = new Set();
          projectsByVisitor[c.visitor_id].add(c.project_name);
        });

        const byProject: Record<string, number> = {};
        clicksRes.data.forEach(c => {
          byProject[c.project_name] = (byProject[c.project_name] ?? 0) + 1;
        });
        setProjectClicks(
          Object.entries(byProject)
            .map(([project_name, clicks]) => ({ project_name, clicks }))
            .sort((a, b) => b.clicks - a.clicks)
        );

        setVisitors(
          Object.entries(visitCountByVisitor)
            .map(([visitor_id, visits]) => ({
              visitor_id,
              visits,
              projects: Array.from(projectsByVisitor[visitor_id] ?? []),
            }))
            .sort((a, b) => b.visits - a.visits)
        );
      } else {
        setVisitors(
          Object.entries(visitCountByVisitor)
            .map(([visitor_id, visits]) => ({ visitor_id, visits, projects: [] }))
            .sort((a, b) => b.visits - a.visits)
        );
      }
    }

    setLoading(false);
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
          <table className="analyticsTable">
            <thead>
              <tr><th>Project</th><th>Opens</th></tr>
            </thead>
            <tbody>
              {projectClicks.map(({ project_name, clicks }) => (
                <tr key={project_name}>
                  <td>{project_name}</td>
                  <td>{clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="analyticsCard analyticsCard--wide">
        <span className="analyticsLabel">Visitors</span>
        {visitors.length === 0 ? (
          <p className="analyticsEmpty">No data yet</p>
        ) : (
          <table className="analyticsTable">
            <thead>
              <tr><th>Visitor</th><th>Visits</th><th>Projects opened</th></tr>
            </thead>
            <tbody>
              {visitors.map(({ visitor_id, visits, projects }) => {
                const short = visitor_id.slice(0, 8);
                const isExpanded = expandedVisitor === visitor_id;
                return (
                  <tr key={visitor_id}>
                    <td className="analyticsVisitorId">{short}…</td>
                    <td>{visits}</td>
                    <td>
                      {projects.length === 0 ? (
                        <span className="analyticsNone">—</span>
                      ) : (
                        <span
                          className="analyticsProjectToggle"
                          onClick={() => setExpandedVisitor(isExpanded ? null : visitor_id)}
                        >
                          {isExpanded
                            ? projects.join(", ")
                            : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export { AdminAnalytics };
