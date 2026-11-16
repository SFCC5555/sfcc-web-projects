import { useState, useEffect, useMemo, useRef, forwardRef, useImperativeHandle } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminCrud.scss";
import "../../styles/admin/AdminDaily.scss";

interface DailyTask {
  id: string;
  title: string;
  archived_at: string | null;
  created_at: string;
}

interface DailyLog {
  task_id: string;
  day: string; // YYYY-MM-DD
}

export interface DailyHandle {
  openAdd: () => void;
}

interface Props {
  onToast: (type: "success" | "error", message: string) => void;
}

/* ── Date helpers (all days are YYYY-MM-DD strings in Ecuador time) ── */

const TZ = "America/Guayaquil";
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

// Calendar day in Ecuador for a timestamp
function ecDay(ts: string | Date = new Date()): string {
  return dayFmt.format(typeof ts === "string" ? new Date(ts) : ts);
}

function pad(n: number): string { return String(n).padStart(2, "0"); }

function parseDay(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addDays(day: string, n: number): string {
  const d = parseDay(day);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function weekday(day: string): number { return parseDay(day).getUTCDay(); }

function monthDays(year: number, month: number): string[] {
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: count }, (_, i) => `${year}-${pad(month)}-${pad(i + 1)}`);
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const WD_SHORT = ["S","M","T","W","T","F","S"];

function fmtPct(v: number | null): string { return v === null ? "—" : `${Math.round(v * 100)}%`; }

async function fetchAllLogs(): Promise<DailyLog[]> {
  // Supabase caps responses at 1000 rows, so page through them
  const all: DailyLog[] = [];
  const size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await supabase
      .from("daily_task_logs")
      .select("task_id, day")
      .order("day", { ascending: true })
      .range(from, from + size - 1);
    if (error) throw error;
    all.push(...(data as DailyLog[]));
    if (!data || data.length < size) break;
  }
  return all;
}

/* ── Line chart ── */

interface ChartPoint { day: string; pct: number | null }

function DailyLineChart({ points, average }: { points: ChartPoint[]; average: number | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  // Render at real pixel width so text stays readable on phones
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setWidth(Math.max(260, entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = 200;
  const m = { top: 12, right: 12, bottom: 26, left: 38 };
  const innerW = width - m.left - m.right;
  const innerH = height - m.top - m.bottom;
  const n = points.length;
  const x = (i: number) => m.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (v: number) => m.top + (1 - v) * innerH;

  // Break the line where a day has no expected tasks
  const segments: { i: number; v: number }[][] = [];
  let current: { i: number; v: number }[] = [];
  points.forEach((p, i) => {
    if (p.pct === null) { if (current.length) segments.push(current); current = []; }
    else current.push({ i, v: p.pct });
  });
  if (current.length) segments.push(current);

  const labelEvery = width < 420 ? 7 : 5;

  return (
    <div className="dailyChart" ref={wrapRef}>
      <svg width={width} height={height} role="img" aria-label="Daily completion percentage">
        {[0, 0.5, 1].map(v => (
          <g key={v}>
            <line className="dailyChartGrid" x1={m.left} x2={width - m.right} y1={y(v)} y2={y(v)} />
            <text className="dailyChartAxis" x={m.left - 8} y={y(v) + 4} textAnchor="end">{v * 100}%</text>
          </g>
        ))}
        {points.map((p, i) => {
          const dayNum = parseInt(p.day.slice(8), 10);
          if (dayNum !== 1 && dayNum % labelEvery !== 0) return null;
          return (
            <text key={p.day} className="dailyChartAxis" x={x(i)} y={height - 8} textAnchor="middle">{dayNum}</text>
          );
        })}
        {average !== null && (
          <line className="dailyChartAvg" x1={m.left} x2={width - m.right} y1={y(average)} y2={y(average)} />
        )}
        {segments.map((seg, si) => (
          <g key={si}>
            {seg.length > 1 && (
              <path
                className="dailyChartArea"
                d={`M${x(seg[0].i)},${y(0)} ` + seg.map(s => `L${x(s.i)},${y(s.v)}`).join(" ") + ` L${x(seg[seg.length - 1].i)},${y(0)} Z`}
              />
            )}
            <path className="dailyChartLine" d={seg.map((s, k) => `${k ? "L" : "M"}${x(s.i)},${y(s.v)}`).join(" ")} />
            {seg.map(s => (
              <circle key={s.i} className="dailyChartDot" cx={x(s.i)} cy={y(s.v)} r={3.5}>
                <title>{`${points[s.i].day}: ${Math.round(s.v * 100)}%`}</title>
              </circle>
            ))}
          </g>
        ))}
      </svg>
      {average !== null && <span className="dailyChartLegend">--- month average {fmtPct(average)}</span>}
    </div>
  );
}

/* ── Main component ── */

const AdminDaily = forwardRef<DailyHandle, Props>(function AdminDaily({ onToast }, ref) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const today = ecDay();
  const [year, setYear] = useState(() => parseInt(today.slice(0, 4), 10));
  const [month, setMonth] = useState(() => parseInt(today.slice(5, 7), 10));
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<DailyTask | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<DailyTask | null>(null);
  const [chartFilter, setChartFilter] = useState<string[] | null>(null); // null = all tasks
  const [chartMode, setChartMode] = useState<"daily" | "rolling">("daily");
  const pending = useRef(new Set<string>());
  const tableWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true);
    try {
      const [{ data, error: tErr }, allLogs] = await Promise.all([
        supabase.from("daily_tasks").select("*").order("created_at", { ascending: true }),
        fetchAllLogs(),
      ]);
      if (tErr) throw tErr;
      setTasks((data ?? []) as DailyTask[]);
      setLogs(allLogs);
    } catch {
      onToast("error", "Could not load daily tasks");
    }
    setLoading(false);
  }

  useImperativeHandle(ref, () => ({
    openAdd() {
      setTitle("");
      setError("");
      setEditing(null);
      setModal("add");
    },
  }));

  /* ── Derived data ── */

  const doneSet = useMemo(() => new Set(logs.map(l => `${l.task_id}|${l.day}`)), [logs]);

  // Active range per task: from creation (or earliest backfilled log) to archive day / today
  const ranges = useMemo(() => {
    const firstLog = new Map<string, string>();
    for (const l of logs) {
      const f = firstLog.get(l.task_id);
      if (!f || l.day < f) firstLog.set(l.task_id, l.day);
    }
    const map = new Map<string, { start: string; end: string }>();
    for (const t of tasks) {
      const created = ecDay(t.created_at);
      const fl = firstLog.get(t.id);
      const start = fl && fl < created ? fl : created;
      const end = t.archived_at ? ecDay(t.archived_at) : today;
      map.set(t.id, { start, end: end < today ? end : today });
    }
    return map;
  }, [tasks, logs, today]);

  function isExpected(taskId: string, day: string): boolean {
    const r = ranges.get(taskId);
    return !!r && day >= r.start && day <= r.end;
  }

  const days = monthDays(year, month);
  const monthFirst = days[0];
  const monthLast = days[days.length - 1];

  // Tasks shown this month: their active range overlaps it
  const monthTasks = tasks.filter(t => {
    const r = ranges.get(t.id)!;
    return r.start <= monthLast && r.end >= monthFirst;
  });
  const archivedTasks = tasks.filter(t => t.archived_at);
  const todayTasks = tasks.filter(t => !t.archived_at);

  // Chart only counts filtered tasks; fall back to all if none of them exist this month
  const filteredIds = chartFilter?.filter(id => monthTasks.some(t => t.id === id)) ?? [];
  const chartTasks = filteredIds.length ? monthTasks.filter(t => filteredIds.includes(t.id)) : monthTasks;
  const isFiltered = filteredIds.length > 0;

  // Completion ratio over a window of days ending at `day` (window 1 = that day only)
  function windowPct(day: string, size: number): number | null {
    let exp = 0, done = 0;
    for (let k = 0; k < size; k++) {
      const d = addDays(day, -k);
      for (const t of chartTasks) {
        if (!isExpected(t.id, d)) continue;
        exp++;
        if (doneSet.has(`${t.id}|${d}`)) done++;
      }
    }
    return exp ? done / exp : null;
  }

  const windowSize = chartMode === "rolling" ? 7 : 1;
  const chartPoints: ChartPoint[] = days.map(day => ({
    day,
    pct: day > today || !chartTasks.some(t => isExpected(t.id, day)) ? null : windowPct(day, windowSize),
  }));

  // Month average for the charted tasks
  let avgExp = 0, avgDone = 0;
  for (const day of days) {
    for (const t of chartTasks) {
      if (!isExpected(t.id, day)) continue;
      avgExp++;
      if (doneSet.has(`${t.id}|${day}`)) avgDone++;
    }
  }
  const chartAverage = avgExp ? avgDone / avgExp : null;

  function toggleChartTask(id: string) {
    const base = isFiltered ? filteredIds : [];
    const next = base.includes(id) ? base.filter(x => x !== id) : [...base, id];
    setChartFilter(next.length ? next : null);
    // A single task is binary per day, so the 7-day trend reads better
    setChartMode(next.length === 1 ? "rolling" : "daily");
  }

  const monthStats = (() => {
    let expected = 0, done = 0, perfect = 0, tracked = 0;
    const perTask = new Map<string, { exp: number; done: number }>();
    for (const day of days) {
      if (day > today) continue;
      let dExp = 0, dDone = 0;
      for (const t of monthTasks) {
        if (!isExpected(t.id, day)) continue;
        const ok = doneSet.has(`${t.id}|${day}`);
        dExp++; if (ok) dDone++;
        const pt = perTask.get(t.id) ?? { exp: 0, done: 0 };
        pt.exp++; if (ok) pt.done++;
        perTask.set(t.id, pt);
      }
      expected += dExp; done += dDone;
      if (dExp > 0) { tracked++; if (dDone === dExp) perfect++; }
    }
    return { pct: expected ? done / expected : null, perfect, tracked, perTask };
  })();

  // All-time streaks per task (today not done yet doesn't break the streak)
  const streaks = useMemo(() => {
    const map = new Map<string, { current: number; best: number }>();
    for (const t of tasks) {
      const r = ranges.get(t.id)!;
      let best = 0, run = 0;
      for (let d = r.start; d <= r.end; d = addDays(d, 1)) {
        if (doneSet.has(`${t.id}|${d}`)) { run++; if (run > best) best = run; }
        else run = 0;
      }
      let current = 0;
      let d = doneSet.has(`${t.id}|${r.end}`) ? r.end : addDays(r.end, -1);
      while (d >= r.start && doneSet.has(`${t.id}|${d}`)) { current++; d = addDays(d, -1); }
      if (t.archived_at) current = 0;
      map.set(t.id, { current, best });
    }
    return map;
  }, [tasks, ranges, doneSet]);

  // All-time completion by weekday
  const bestWeekday = useMemo(() => {
    const exp = Array(7).fill(0), done = Array(7).fill(0);
    for (const t of tasks) {
      const r = ranges.get(t.id)!;
      for (let d = r.start; d <= r.end; d = addDays(d, 1)) {
        const w = weekday(d);
        exp[w]++;
        if (doneSet.has(`${t.id}|${d}`)) done[w]++;
      }
    }
    let best = -1, bestPct = -1;
    exp.forEach((e, w) => { if (e && done[w] / e > bestPct) { bestPct = done[w] / e; best = w; } });
    return best < 0 ? null : { day: WEEKDAYS[best], pct: bestPct };
  }, [tasks, ranges, doneSet]);

  const ranked = monthTasks
    .map(t => {
      const s = monthStats.perTask.get(t.id);
      return { task: t, pct: s && s.exp ? s.done / s.exp : null };
    })
    .filter(r => r.pct !== null) as { task: DailyTask; pct: number }[];
  ranked.sort((a, b) => b.pct - a.pct);
  const topTask = ranked[0];
  const lowTask = ranked.length > 1 ? ranked[ranked.length - 1] : undefined;

  let bestStreak: { title: string; best: number } | null = null;
  for (const t of tasks) {
    const s = streaks.get(t.id)!;
    if (s.best > 0 && (!bestStreak || s.best > bestStreak.best)) bestStreak = { title: t.title, best: s.best };
  }

  const todayDone = todayTasks.filter(t => doneSet.has(`${t.id}|${today}`)).length;

  // Month navigation bounds
  const earliest = tasks.reduce((min, t) => {
    const s = ranges.get(t.id)!.start;
    return s < min ? s : min;
  }, today);
  const curKey = `${year}-${pad(month)}`;
  const canPrev = curKey > earliest.slice(0, 7);
  const canNext = curKey < today.slice(0, 7);

  function shiftMonth(delta: number) {
    const d = new Date(Date.UTC(year, month - 1 + delta, 1));
    setYear(d.getUTCFullYear());
    setMonth(d.getUTCMonth() + 1);
  }

  // Keep today's column in view when the table opens
  useEffect(() => {
    const wrap = tableWrapRef.current;
    const cell = wrap?.querySelector<HTMLElement>(".dailyTh--today");
    if (wrap && cell) wrap.scrollLeft = cell.offsetLeft - wrap.clientWidth / 2;
  }, [loading, curKey]);

  /* ── Mutations ── */

  async function toggle(taskId: string, day: string) {
    const key = `${taskId}|${day}`;
    if (pending.current.has(key)) return;
    pending.current.add(key);
    const wasDone = doneSet.has(key);
    const apply = (done: boolean) =>
      setLogs(prev => done
        ? [...prev, { task_id: taskId, day }]
        : prev.filter(l => !(l.task_id === taskId && l.day === day)));

    apply(!wasDone); // optimistic
    const { error: err } = wasDone
      ? await supabase.from("daily_task_logs").delete().eq("task_id", taskId).eq("day", day)
      : await supabase.from("daily_task_logs").insert({ task_id: taskId, day });
    if (err) { apply(wasDone); onToast("error", "Could not save — try again"); }
    pending.current.delete(key);
  }

  function openEdit(t: DailyTask) {
    setEditing(t);
    setTitle(t.title);
    setError("");
    setModal("edit");
  }

  function closeModal() { setModal(null); setEditing(null); setError(""); }

  async function handleSave() {
    const value = title.trim();
    if (!value) { setError("Title is required."); return; }
    setSaving(true);
    if (modal === "add") {
      const { data, error: err } = await supabase.from("daily_tasks").insert({ title: value }).select().single();
      if (err || !data) onToast("error", "Could not add task");
      else setTasks(prev => [...prev, data as DailyTask]);
    } else if (editing) {
      const { error: err } = await supabase.from("daily_tasks").update({ title: value }).eq("id", editing.id);
      if (err) onToast("error", "Could not rename task");
      else setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, title: value } : t));
    }
    setSaving(false);
    closeModal();
  }

  async function setArchived(t: DailyTask, archive: boolean) {
    const archived_at = archive ? new Date().toISOString() : null;
    const { error: err } = await supabase.from("daily_tasks").update({ archived_at }).eq("id", t.id);
    if (err) { onToast("error", "Could not update task"); return; }
    setTasks(prev => prev.map(x => x.id === t.id ? { ...x, archived_at } : x));
    onToast("success", archive ? "Task archived — history kept" : "Task restored");
    closeModal();
  }

  async function handleDelete(t: DailyTask) {
    const { error: err } = await supabase.from("daily_tasks").delete().eq("id", t.id);
    if (err) { onToast("error", "Could not delete task"); return; }
    setTasks(prev => prev.filter(x => x.id !== t.id));
    setLogs(prev => prev.filter(l => l.task_id !== t.id));
    setConfirmDelete(null);
    closeModal();
  }

  if (loading) return <div className="crudLoading">Loading…</div>;

  return (
    <div className="dailyPanel">

      {tasks.length === 0 ? (
        <div className="crudEmpty">No daily tasks yet — add one to get started.</div>
      ) : (
        <>
          {/* Today checklist */}
          <section className="dailyCard">
            <div className="dailyCardHead">
              <h2 className="dailyCardTitle">Today</h2>
              <span className="dailyCardMeta">{todayDone}/{todayTasks.length} done</span>
            </div>
            <ul className="dailyTodayList">
              {todayTasks.map(t => {
                const done = doneSet.has(`${t.id}|${today}`);
                return (
                  <li key={t.id}>
                    <label className={`dailyTodayItem${done ? " dailyTodayItem--done" : ""}`}>
                      <input type="checkbox" checked={done} onChange={() => toggle(t.id, today)} />
                      <span>{t.title}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Month navigation */}
          <div className="dailyMonthNav">
            <button className="crudBtn" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Previous month">‹</button>
            <span className="dailyMonthLabel">{MONTHS[month - 1]} {year}</span>
            <button className="crudBtn" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Next month">›</button>
          </div>

          {/* Stats */}
          <div className="dailyStats">
            <div className="dailyStat">
              <span className="dailyStatLabel">Month</span>
              <span className="dailyStatValue">{fmtPct(monthStats.pct)}</span>
            </div>
            <div className="dailyStat">
              <span className="dailyStatLabel">Perfect days</span>
              <span className="dailyStatValue">{monthStats.perfect}<small>/{monthStats.tracked}</small></span>
            </div>
            <div className="dailyStat">
              <span className="dailyStatLabel">Best streak</span>
              <span className="dailyStatValue">{bestStreak ? `${bestStreak.best}d` : "—"}</span>
              {bestStreak && <span className="dailyStatSub">{bestStreak.title}</span>}
            </div>
            <div className="dailyStat">
              <span className="dailyStatLabel">Best weekday</span>
              <span className="dailyStatValue dailyStatValue--sm">{bestWeekday ? bestWeekday.day : "—"}</span>
              {bestWeekday && <span className="dailyStatSub">{fmtPct(bestWeekday.pct)} all-time</span>}
            </div>
            <div className="dailyStat">
              <span className="dailyStatLabel">Most consistent</span>
              <span className="dailyStatValue dailyStatValue--sm">{topTask ? fmtPct(topTask.pct) : "—"}</span>
              {topTask && <span className="dailyStatSub">{topTask.task.title}</span>}
            </div>
            <div className="dailyStat">
              <span className="dailyStatLabel">Needs attention</span>
              <span className="dailyStatValue dailyStatValue--sm">{lowTask ? fmtPct(lowTask.pct) : "—"}</span>
              {lowTask && <span className="dailyStatSub">{lowTask.task.title}</span>}
            </div>
          </div>

          {/* Spreadsheet-style grid */}
          <section className="dailyCard dailyCard--flush">
            {monthTasks.length === 0 ? (
              <div className="crudEmpty">No tasks were active this month.</div>
            ) : (
              <div className="dailyTableWrap" ref={tableWrapRef}>
                <table className="dailyTable">
                  <thead>
                    <tr>
                      <th className="dailyTh dailyTh--task">Task</th>
                      {days.map(d => (
                        <th key={d} className={`dailyTh${d === today ? " dailyTh--today" : ""}${[0, 6].includes(weekday(d)) ? " dailyTh--weekend" : ""}`}>
                          <span className="dailyThWd">{WD_SHORT[weekday(d)]}</span>
                          <span>{parseInt(d.slice(8), 10)}</span>
                        </th>
                      ))}
                      <th className="dailyTh dailyTh--stat">%</th>
                      <th className="dailyTh dailyTh--stat" title="Current streak">🔥</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthTasks.map(t => {
                      const r = ranges.get(t.id)!;
                      const s = monthStats.perTask.get(t.id);
                      return (
                        <tr key={t.id} className={t.archived_at ? "dailyRow--archived" : ""}>
                          <td className="dailyTd dailyTd--task">
                            <button className="dailyTaskName" onClick={() => openEdit(t)} title="Edit">
                              {t.title}
                            </button>
                          </td>
                          {days.map(d => {
                            const done = doneSet.has(`${t.id}|${d}`);
                            const future = d > today;
                            const afterArchive = !!t.archived_at && d > r.end;
                            const state = done ? "done"
                              : future || afterArchive ? "off"
                              : d < r.start ? "before"
                              : d === today ? "pending" : "missed";
                            return (
                              <td key={d} className={`dailyTd${d === today ? " dailyTd--today" : ""}`}>
                                <button
                                  className={`dailyCell dailyCell--${state}`}
                                  disabled={future || afterArchive}
                                  onClick={() => toggle(t.id, d)}
                                  aria-label={`${t.title} ${d}: ${done ? "done" : "not done"}`}
                                >
                                  {done ? "✓" : state === "missed" ? "·" : ""}
                                </button>
                              </td>
                            );
                          })}
                          <td className="dailyTd dailyTd--stat">{fmtPct(s && s.exp ? s.done / s.exp : null)}</td>
                          <td className="dailyTd dailyTd--stat">{streaks.get(t.id)!.current || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Line chart */}
          <section className="dailyCard">
            <div className="dailyCardHead">
              <h2 className="dailyCardTitle">{chartMode === "rolling" ? "7-day trend" : "Daily completion"}</h2>
              <div className="dailyModeToggle" role="group" aria-label="Chart mode">
                {(["daily", "rolling"] as const).map(mode => (
                  <button
                    key={mode}
                    className={`dailyChip${chartMode === mode ? " dailyChip--active" : ""}`}
                    onClick={() => setChartMode(mode)}
                  >
                    {mode === "daily" ? "Daily" : "7 days"}
                  </button>
                ))}
              </div>
            </div>
            {monthTasks.length > 1 && (
              <div className="dailyChipRow">
                <button
                  className={`dailyChip${!isFiltered ? " dailyChip--active" : ""}`}
                  onClick={() => { setChartFilter(null); setChartMode("daily"); }}
                >
                  All
                </button>
                {monthTasks.map(t => (
                  <button
                    key={t.id}
                    className={`dailyChip${filteredIds.includes(t.id) ? " dailyChip--active" : ""}`}
                    onClick={() => toggleChartTask(t.id)}
                    aria-pressed={filteredIds.includes(t.id)}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            )}
            <DailyLineChart points={chartPoints} average={chartAverage} />
          </section>

          {/* Archived tasks */}
          {archivedTasks.length > 0 && (
            <section className="dailyCard">
              <div className="dailyCardHead">
                <h2 className="dailyCardTitle">Archived</h2>
                <span className="dailyCardMeta">{archivedTasks.length}</span>
              </div>
              <ul className="dailyArchivedList">
                {archivedTasks.map(t => (
                  <li key={t.id} className="dailyArchivedItem">
                    <span>{t.title}</span>
                    <button className="crudBtn" onClick={() => setArchived(t, false)}>Restore</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div className="crudOverlay" onClick={closeModal}>
          <div className="crudModal crudModal--sm" onClick={e => e.stopPropagation()}>
            <h2 className="crudModalTitle">{modal === "add" ? "New Daily Task" : "Edit Daily Task"}</h2>
            <div className="crudForm">
              <div className="crudFormGroup">
                <label>Title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Read 30 minutes"
                  autoFocus
                  onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
                />
              </div>
              {error && <p className="crudError">{error}</p>}
            </div>
            <div className="crudModalFooter dailyModalFooter">
              {modal === "edit" && editing && (
                <div className="dailyModalDanger">
                  <button className="crudBtn" onClick={() => setArchived(editing, !editing.archived_at)} disabled={saving}>
                    {editing.archived_at ? "Restore" : "Archive"}
                  </button>
                  <button className="crudBtn crudBtn--danger" onClick={() => setConfirmDelete(editing)} disabled={saving}>
                    Delete
                  </button>
                </div>
              )}
              <button className="crudBtn" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="crudBtn crudBtn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : modal === "add" ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="crudOverlay" onClick={() => setConfirmDelete(null)}>
          <div className="crudConfirm" onClick={e => e.stopPropagation()}>
            <p>Delete “{confirmDelete.title}” and all its history? Use Archive to keep the record.</p>
            <div className="crudModalFooter">
              <button className="crudBtn" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="crudBtn crudBtn--danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

export { AdminDaily };
