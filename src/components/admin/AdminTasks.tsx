import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminCrud.scss";
import "../../styles/admin/AdminTasks.scss";

type TaskStatus = "todo" | "in-progress" | "done";
type TaskPriority = "high" | "medium" | "low";
type RecurFrequency = "none" | "daily" | "weekly";

interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

interface AdminTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  deadline: string | null;
  notes: string;
  subtasks: Subtask[];
  recurring: RecurFrequency;
  recur_time: string;
  recur_day: number;
  created_at: string;
}

export interface TasksHandle {
  openAdd: () => void;
}

function genId(): string { return crypto.randomUUID(); }

function daysDiff(deadline: string | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline + "T00:00:00");
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

function fmtDeadline(deadline: string | null): string {
  if (!deadline) return "";
  const [y, m, d] = deadline.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

const DAYS_OF_WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_LABELS: Record<TaskStatus, string> = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
const SUGGESTED_CATEGORIES = ["General","Job Search","Learning","Projects","Health","English","Admin","Networking"];

const BLANK = {
  title: "",
  description: "",
  status: "todo" as TaskStatus,
  priority: "medium" as TaskPriority,
  category: "General",
  deadline: "",
  notes: "",
  subtasks: [] as Subtask[],
  recurring: "none" as RecurFrequency,
  recur_time: "08:00",
  recur_day: 1,
};

function sortTasks(tasks: AdminTask[]): AdminTask[] {
  return [...tasks].sort((a, b) => {
    if (a.status === "done" && b.status !== "done") return 1;
    if (b.status === "done" && a.status !== "done") return -1;
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority])
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;
    return a.created_at.localeCompare(b.created_at);
  });
}

const AdminTasks = forwardRef<TasksHandle>(function AdminTasks(_, ref) {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all" | "recurring">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [newSubtask, setNewSubtask] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true });
    if (data) setTasks(data as AdminTask[]);
    setLoading(false);
  }

  useImperativeHandle(ref, () => ({
    openAdd() {
      setForm({ ...BLANK });
      setNewSubtask("");
      setError("");
      setEditingId(null);
      setModal("add");
    },
  }));

  function openEdit(task: AdminTask) {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      deadline: task.deadline ?? "",
      notes: task.notes,
      subtasks: task.subtasks,
      recurring: task.recurring,
      recur_time: task.recur_time,
      recur_day: task.recur_day,
    });
    setNewSubtask("");
    setError("");
    setEditingId(task.id);
    setModal("edit");
  }

  function closeModal() { setModal(null); setEditingId(null); setError(""); }

  async function handleSave() {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description,
      status: form.status,
      priority: form.priority,
      category: form.category.trim() || "General",
      deadline: form.deadline || null,
      notes: form.notes,
      subtasks: form.subtasks,
      recurring: form.recurring,
      recur_time: form.recur_time,
      recur_day: form.recur_day,
    };

    if (modal === "add") {
      const { data } = await supabase.from("tasks").insert(payload).select().single();
      if (data) setTasks(prev => [...prev, data as AdminTask]);
    } else {
      const { data } = await supabase.from("tasks").update(payload).eq("id", editingId).select().single();
      if (data) setTasks(prev => prev.map(t => t.id === editingId ? data as AdminTask : t));
    }

    setSaving(false);
    closeModal();
  }

  async function handleDelete(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setConfirmDelete(null);
    if (expandedId === id) setExpandedId(null);
  }

  async function quickCycleStatus(task: AdminTask) {
    const next: TaskStatus =
      task.status === "todo" ? "in-progress" : task.status === "in-progress" ? "done" : "todo";
    await supabase.from("tasks").update({ status: next }).eq("id", task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: next } : t));
  }

  async function toggleSubtask(task: AdminTask, subId: string) {
    const updated = task.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
    await supabase.from("tasks").update({ subtasks: updated }).eq("id", task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, subtasks: updated } : t));
  }

  function addFormSubtask() {
    const text = newSubtask.trim();
    if (!text) return;
    setForm(f => ({ ...f, subtasks: [...f.subtasks, { id: genId(), text, done: false }] }));
    setNewSubtask("");
  }

  function removeFormSubtask(id: string) {
    setForm(f => ({ ...f, subtasks: f.subtasks.filter(s => s.id !== id) }));
  }

  const allCategories = Array.from(new Set(tasks.map(t => t.category))).sort();

  const filtered = sortTasks(tasks).filter(t => {
    if (statusFilter === "recurring") return t.recurring !== "none";
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const alerts = tasks
    .filter(t => t.status !== "done" && t.deadline && (daysDiff(t.deadline) ?? 1) <= 3)
    .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""));

  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    "in-progress": tasks.filter(t => t.status === "in-progress").length,
    done: tasks.filter(t => t.status === "done").length,
    recurring: tasks.filter(t => t.recurring !== "none").length,
  };

  if (loading) return <div className="crudLoading">Loading…</div>;

  return (
    <div className="taskPanel">

      {/* Deadline alerts */}
      {alerts.length > 0 && (
        <div className="taskAlerts">
          {alerts.map(t => {
            const diff = daysDiff(t.deadline)!;
            const isOverdue = diff < 0;
            const label = isOverdue
              ? `Overdue by ${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""}`
              : diff === 0 ? "Due today"
              : `Due in ${diff} day${diff !== 1 ? "s" : ""}`;
            return (
              <div key={t.id} className={`taskAlert taskAlert--${isOverdue ? "overdue" : "soon"}`}>
                <span className="taskAlertIcon">{isOverdue ? "⚠" : "🔔"}</span>
                <span className="taskAlertTitle">{t.title}</span>
                <span className="taskAlertLabel">{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="taskFilters">
        <div className="taskStatusFilters">
          {(["all","todo","in-progress","done","recurring"] as const).map(f => (
            <button
              key={f}
              className={`taskFilterBtn${statusFilter === f ? " taskFilterBtn--active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {f === "all" ? "All" : f === "recurring" ? "Recurring" : STATUS_LABELS[f as TaskStatus]}
              <span className="taskFilterCount">{counts[f]}</span>
            </button>
          ))}
        </div>
        {allCategories.length > 1 && (
          <select
            className="taskCategoryFilter"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="crudEmpty">
          {tasks.length === 0 ? "No tasks yet — add one to get started." : "No tasks match this filter."}
        </div>
      ) : (
        <div className="taskList">
          {filtered.map(task => {
            const diff = daysDiff(task.deadline);
            const isExpanded = expandedId === task.id;
            const doneCount = task.subtasks.filter(s => s.done).length;

            return (
              <div
                key={task.id}
                className={`taskCard taskCard--${task.priority}${task.status === "done" ? " taskCard--done" : ""}`}
              >
                <div className="taskCardHeader">
                  <button
                    className={`taskStatusBtn taskStatusBtn--${task.status}`}
                    onClick={() => quickCycleStatus(task)}
                    title={`${STATUS_LABELS[task.status]} — click to cycle`}
                  />
                  <div className="taskCardMain" onClick={() => setExpandedId(isExpanded ? null : task.id)}>
                    <span className={`taskTitle${task.status === "done" ? " taskTitle--done" : ""}`}>
                      {task.title}
                    </span>
                    <div className="taskMeta">
                      <span className="taskCatBadge">{task.category}</span>
                      {task.status !== "done" && task.deadline && diff !== null && (
                        <span className={`taskDL taskDL--${diff < 0 ? "overdue" : diff <= 3 ? "soon" : "ok"}`}>
                          {diff < 0 ? `${Math.abs(diff)}d overdue`
                            : diff === 0 ? "Today"
                            : `${diff}d left`}
                        </span>
                      )}
                      {task.recurring !== "none" && (
                        <span className="taskRecurBadge">
                          ↻ {task.recurring === "daily"
                            ? `Daily ${task.recur_time}`
                            : `${DAYS_OF_WEEK[task.recur_day]} ${task.recur_time}`}
                        </span>
                      )}
                      {task.subtasks.length > 0 && (
                        <span className="taskSubCount">{doneCount}/{task.subtasks.length} done</span>
                      )}
                    </div>
                  </div>
                  <span className="taskExpandIcon">{isExpanded ? "▴" : "▾"}</span>
                  <div className="taskActions">
                    <button className="crudBtn" onClick={() => openEdit(task)}>Edit</button>
                    <button className="crudBtn crudBtn--danger" onClick={() => setConfirmDelete(task.id)}>×</button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="taskBody">
                    {task.description && <p className="taskDesc">{task.description}</p>}
                    {task.subtasks.length > 0 && (
                      <ul className="taskSubList">
                        {task.subtasks.map(sub => (
                          <li key={sub.id} className={`taskSubItem${sub.done ? " taskSubItem--done" : ""}`}>
                            <input
                              type="checkbox"
                              checked={sub.done}
                              onChange={() => toggleSubtask(task, sub.id)}
                            />
                            <span>{sub.text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {task.notes && (
                      <div className="taskNotes">
                        <span className="taskNotesLabel">Notes</span>
                        <p className="taskNotesText">{task.notes}</p>
                      </div>
                    )}
                    {task.deadline && (
                      <p className="taskDeadlineFull">Deadline: {fmtDeadline(task.deadline)}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit modal */}
      {modal && (
        <div className="crudOverlay" onClick={closeModal}>
          <div className="crudModal" onClick={e => e.stopPropagation()}>
            <h2 className="crudModalTitle">{modal === "add" ? "New Task" : "Edit Task"}</h2>
            <div className="crudForm">

              <div className="crudFormGroup">
                <label>Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="What needs to be done?"
                  autoFocus
                  onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
                />
              </div>

              <div className="crudFormRow2">
                <div className="crudFormGroup">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="crudFormGroup">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="crudFormRow2">
                <div className="crudFormGroup">
                  <label>Category</label>
                  <input
                    list="sfcc-task-categories"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    placeholder="General"
                  />
                  <datalist id="sfcc-task-categories">
                    {SUGGESTED_CATEGORIES.map(c => <option key={c} value={c} />)}
                    {allCategories.filter(c => !SUGGESTED_CATEGORIES.includes(c)).map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div className="crudFormGroup">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="crudFormGroup">
                <label>Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional details…"
                />
              </div>

              <div className="crudFormGroup">
                <label>Recurring</label>
                <div className="taskRecurRow">
                  <select
                    value={form.recurring}
                    onChange={e => setForm(f => ({ ...f, recurring: e.target.value as RecurFrequency }))}
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  {form.recurring !== "none" && (
                    <>
                      {form.recurring === "weekly" && (
                        <select
                          value={form.recur_day}
                          onChange={e => setForm(f => ({ ...f, recur_day: parseInt(e.target.value) }))}
                        >
                          {DAYS_OF_WEEK.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                      )}
                      <input
                        type="time"
                        value={form.recur_time}
                        onChange={e => setForm(f => ({ ...f, recur_time: e.target.value }))}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="crudFormGroup">
                <label>Subtasks</label>
                {form.subtasks.length > 0 && (
                  <ul className="taskFormSubList">
                    {form.subtasks.map(s => (
                      <li key={s.id} className="taskFormSubItem">
                        <span>{s.text}</span>
                        <button type="button" className="taskFormSubRemove" onClick={() => removeFormSubtask(s.id)}>×</button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="taskFormSubAdd">
                  <input
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFormSubtask(); } }}
                    placeholder="Add subtask and press Enter…"
                  />
                  <button type="button" className="crudBtn" onClick={addFormSubtask}>Add</button>
                </div>
              </div>

              <div className="crudFormGroup">
                <label>Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Additional notes…"
                />
              </div>

              {error && <p className="crudError">{error}</p>}
            </div>

            <div className="crudModalFooter">
              <button className="crudBtn" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="crudBtn crudBtn--primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : modal === "add" ? "Add Task" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="crudOverlay" onClick={() => setConfirmDelete(null)}>
          <div className="crudConfirm" onClick={e => e.stopPropagation()}>
            <p>Delete this task?</p>
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

export { AdminTasks };
