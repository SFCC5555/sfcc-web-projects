import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminCrud.scss";

export interface ProjectsHandle {
  openAdd: () => void;
}

interface AdminProjectsProps {
  onToast: (type: "success" | "error", message: string) => void;
}

interface Project {
  id: string;
  name: string;
  link: string;
  repository: string | null;
  backend_repository: string | null;
  repository_private: boolean;
  backend_repository_private: boolean;
  cover_url: string | null;
  skill_list: string[];
  info: string;
  date: string | null;
  type: string;
  sort_order: number;
}

interface FormState {
  name: string;
  link: string;
  repository: string;
  backend_repository: string;
  repository_private: boolean;
  backend_repository_private: boolean;
  info: string;
  type: string;
  sort_order: number;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function monthValueToDisplay(v: string): string {
  const [year, month] = v.split("-");
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

function displayToMonthValue(d: string): string {
  const parts = d.trim().split(" ");
  if (parts.length !== 2) return "";
  const idx = MONTHS.indexOf(parts[0]);
  if (idx === -1) return "";
  return `${parts[1]}-${String(idx + 1).padStart(2, "0")}`;
}

const EMPTY: FormState = {
  name: "", link: "", repository: "", backend_repository: "",
  repository_private: false, backend_repository_private: false,
  info: "", type: "project", sort_order: 0,
};

const AdminProjects = forwardRef<ProjectsHandle, AdminProjectsProps>(({ onToast }, ref) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTechs, setAllTechs] = useState<{ name: string; icon_url: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"none" | "add" | "edit">("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [dateInput, setDateInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingCoverUrl, setExistingCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({ openAdd }));
  useEffect(() => { load(); }, []);

  async function load() {
    const [projectsRes, techsRes] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("technologies").select("name, icon_url").order("sort_order"),
    ]);
    if (projectsRes.data) setProjects(projectsRes.data);
    if (techsRes.data) setAllTechs(techsRes.data);
    setLoading(false);
  }

  function resetExtras() {
    setDateInput("");
    setCoverFile(null);
    setCoverPreview("");
    setExistingCoverUrl("");
    setSelectedSkills([]);
  }

  function openAdd() {
    setForm({ ...EMPTY, sort_order: projects.length });
    resetExtras();
    setEditingId(null);
    setFormMode("add");
    setError(null);
  }

  function openEdit(p: Project) {
    setForm({
      name: p.name, link: p.link,
      repository: p.repository ?? "",
      backend_repository: p.backend_repository ?? "",
      repository_private: p.repository_private,
      backend_repository_private: p.backend_repository_private,
      info: p.info, type: p.type, sort_order: p.sort_order,
    });
    setDateInput(displayToMonthValue(p.date ?? ""));
    setExistingCoverUrl(p.cover_url ?? "");
    setCoverFile(null);
    setCoverPreview("");
    setSelectedSkills(p.skill_list ?? []);
    setEditingId(p.id);
    setFormMode("edit");
    setError(null);
  }

  function close() {
    setFormMode("none");
    setEditingId(null);
    setError(null);
    resetExtras();
  }

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function toggleSkill(name: string) {
    setSelectedSkills(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function uploadCover(projectId: string): Promise<string | null> {
    if (!coverFile) return null;
    const ext = coverFile.name.split(".").pop() ?? "jpg";
    const path = `${projectId}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("project-covers")
      .upload(path, coverFile, { upsert: true });
    if (uploadErr) { setError(`Image upload failed: ${uploadErr.message}`); return null; }
    const { data } = supabase.storage.from("project-covers").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!form.name.trim() || !form.link.trim() || !form.info.trim()) {
      setError("Name, link, and info are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const basePayload = {
      ...form,
      skill_list: selectedSkills,
      date: dateInput ? monthValueToDisplay(dateInput) : null,
      repository: form.repository || null,
      backend_repository: form.backend_repository || null,
    };

    if (formMode === "add") {
      const { data: inserted, error: e } = await supabase
        .from("projects")
        .insert([{ ...basePayload, cover_url: null }])
        .select()
        .single();
      if (e) { setError(e.message); setSaving(false); return; }
      if (coverFile && inserted) {
        const url = await uploadCover(inserted.id);
        if (url) await supabase.from("projects").update({ cover_url: url }).eq("id", inserted.id);
      }
    } else {
      let cover_url: string | null = existingCoverUrl || null;
      if (coverFile && editingId) {
        const url = await uploadCover(editingId);
        if (url) cover_url = url;
        else { setSaving(false); return; }
      }
      const { error: e } = await supabase
        .from("projects")
        .update({ ...basePayload, cover_url })
        .eq("id", editingId);
      if (e) { setError(e.message); setSaving(false); return; }
    }

    await load();
    setSaving(false);
    onToast("success", formMode === "add" ? "Project added" : "Project updated");
    close();
  }

  async function remove(id: string) {
    const project = projects.find(p => p.id === id);
    if (project?.cover_url) {
      const parts = project.cover_url.split("/project-covers/");
      if (parts.length === 2) {
        await supabase.storage.from("project-covers").remove([parts[1]]);
      }
    }
    await supabase.from("projects").delete().eq("id", id);
    setDeleteId(null);
    await load();
    onToast("success", "Project deleted");
  }

  return (
    <>
      {loading ? (
        <div className="crudLoading">Loading…</div>
      ) : (
        <div className="crudTable crudTable--projects">
          <div className="crudTableHead">
            <span>Name</span><span>Type</span><span>Date</span><span>#</span><span></span>
          </div>
          {projects.length === 0 && <div className="crudEmpty">No projects yet.</div>}
          {projects.map(p => (
            <div className="crudTableRow" key={p.id}>
              <span className="crudCell crudName">
                <a href={p.link} target="_blank" rel="noreferrer">{p.name}</a>
              </span>
              <span className={`crudCell crudBadge crudBadge--${p.type}`}>{p.type}</span>
              <span className="crudCell crudMuted">{p.date || "—"}</span>
              <span className="crudCell crudMuted">{p.sort_order}</span>
              <span className="crudCell crudActions">
                <button className="crudBtn" onClick={() => openEdit(p)}>Edit</button>
                <button className="crudBtn crudBtn--danger" onClick={() => setDeleteId(p.id)}>Del</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {formMode !== "none" && (
        <div className="crudOverlay" onClick={close}>
          <div className="crudModal" onClick={e => e.stopPropagation()}>
            <h3 className="crudModalTitle">
              {formMode === "add" ? "Add Project" : "Edit Project"}
            </h3>
            <div className="crudForm">

              {/* Name */}
              <div className="crudFormGroup">
                <label>Name *</label>
                <input value={form.name} onChange={e => setField("name", e.target.value)} />
              </div>

              {/* Link */}
              <div className="crudFormGroup">
                <label>Link *</label>
                <input value={form.link} onChange={e => setField("link", e.target.value)} placeholder="https://myapp.com" />
              </div>

              {/* Repositories */}
              <div className="crudFormRow2">
                <div className="crudFormGroup">
                  <label>Frontend Repository</label>
                  <input value={form.repository} onChange={e => setField("repository", e.target.value)} placeholder="https://github.com/user/repo" />
                </div>
                <div className="crudFormGroup">
                  <label>Backend Repository</label>
                  <input value={form.backend_repository} onChange={e => setField("backend_repository", e.target.value)} placeholder="https://github.com/user/repo-api" />
                </div>
              </div>

              {/* Private flags */}
              <div className="crudFormRow2">
                <label className="crudCheckLabel">
                  <input type="checkbox" checked={form.repository_private} onChange={e => setField("repository_private", e.target.checked)} />
                  Frontend repo is private
                </label>
                <label className="crudCheckLabel">
                  <input type="checkbox" checked={form.backend_repository_private} onChange={e => setField("backend_repository_private", e.target.checked)} />
                  Backend repo is private
                </label>
              </div>

              {/* Type + Date + Sort */}
              <div className="crudFormRow3">
                <div className="crudFormGroup">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setField("type", e.target.value)}>
                    <option value="project">project</option>
                    <option value="contribution">contribution</option>
                  </select>
                </div>
                <div className="crudFormGroup">
                  <label>Date</label>
                  <input type="month" value={dateInput} onChange={e => setDateInput(e.target.value)} />
                </div>
                <div className="crudFormGroup">
                  <label>Sort order</label>
                  <input type="number" value={form.sort_order} onChange={e => setField("sort_order", Number(e.target.value))} />
                </div>
              </div>

              {/* Technologies */}
              <div className="crudFormGroup">
                <label>
                  Technologies
                  {selectedSkills.length > 0 && (
                    <span className="techPickerCount"> ({selectedSkills.length} selected)</span>
                  )}
                </label>
                {allTechs.length === 0 ? (
                  <p className="crudMuted" style={{ margin: 0, fontSize: "1.1rem" }}>
                    No technologies found — add some in the Technologies tab first.
                  </p>
                ) : (
                  <div className="techTagPicker">
                    {allTechs.map(tech => (
                      <button
                        key={tech.name}
                        type="button"
                        onClick={() => toggleSkill(tech.name)}
                        className={`techTag${selectedSkills.includes(tech.name) ? " techTag--selected" : ""}`}
                      >
                        {tech.icon_url && (
                          <img src={tech.icon_url} alt="" className="techTagIcon" />
                        )}
                        {tech.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cover image */}
              <div className="crudFormGroup">
                <label>Cover Image</label>
                {(coverPreview || existingCoverUrl) && (
                  <img
                    className="crudCoverPreview"
                    src={coverPreview || existingCoverUrl}
                    alt="cover preview"
                  />
                )}
                <input type="file" accept="image/*" onChange={handleCoverChange} className="crudFileInput" />
              </div>

              {/* Info */}
              <div className="crudFormGroup">
                <label>Info *</label>
                <textarea rows={6} value={form.info} onChange={e => setField("info", e.target.value)} />
              </div>

            </div>
            {error && <p className="crudError">{error}</p>}
            <div className="crudModalFooter">
              <button className="crudBtn" onClick={close}>Cancel</button>
              <button className="crudBtn crudBtn--primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="crudOverlay" onClick={() => setDeleteId(null)}>
          <div className="crudConfirm" onClick={e => e.stopPropagation()}>
            <p>Delete this project? This cannot be undone.</p>
            <div className="crudModalFooter">
              <button className="crudBtn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="crudBtn crudBtn--danger" onClick={() => remove(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export { AdminProjects };
