import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminCrud.scss";

export interface TechnologiesHandle {
  openAdd: () => void;
}

interface AdminTechnologiesProps {
  onToast: (type: "success" | "error", message: string) => void;
}

interface Technology {
  id: string;
  name: string;
  icon_url: string | null;
  sort_order: number;
}

interface FormState {
  name: string;
}

const EMPTY: FormState = { name: "" };

const AdminTechnologies = forwardRef<TechnologiesHandle, AdminTechnologiesProps>(({ onToast }, ref) => {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"none" | "add" | "edit">("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState("");
  const [existingIconUrl, setExistingIconUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({ openAdd }));

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("technologies").select("*").order("sort_order");
    if (data) setTechs(data);
    setLoading(false);
  }

  function resetExtras() {
    setIconFile(null);
    setIconPreview("");
    setExistingIconUrl("");
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId.current || dragId.current === targetId) { setDragOverId(null); return; }
    const list = [...techs];
    const fromIdx = list.findIndex(t => t.id === dragId.current);
    const toIdx = list.findIndex(t => t.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragOverId(null); return; }
    const [removed] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, removed);
    const updated = list.map((t, i) => ({ ...t, sort_order: i }));
    setTechs(updated);
    await Promise.all(updated.map(t => supabase.from("technologies").update({ sort_order: t.sort_order }).eq("id", t.id)));
    dragId.current = null;
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDragOverId(null);
    dragId.current = null;
  }

  function openAdd() {
    setForm({ name: "" });
    resetExtras();
    setEditingId(null);
    setFormMode("add");
    setError(null);
  }

  function openEdit(t: Technology) {
    setForm({ name: t.name });
    setExistingIconUrl(t.icon_url ?? "");
    setIconFile(null);
    setIconPreview("");
    setEditingId(t.id);
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

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
  }

  async function uploadIcon(techId: string): Promise<string | null> {
    if (!iconFile) return null;
    const ext = iconFile.name.split(".").pop() ?? "png";
    const path = `${techId}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("technology-icons")
      .upload(path, iconFile, { upsert: true });
    if (uploadErr) { setError(`Icon upload failed: ${uploadErr.message}`); return null; }
    const { data } = supabase.storage.from("technology-icons").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError(null);

    if (formMode === "add") {
      if (techs.length > 0) {
        await Promise.all(techs.map(t => supabase.from("technologies").update({ sort_order: t.sort_order + 1 }).eq("id", t.id)));
      }
      const { data: inserted, error: e } = await supabase
        .from("technologies")
        .insert([{ ...form, sort_order: 0, icon_url: null }])
        .select()
        .single();
      if (e) { setError(e.message); setSaving(false); return; }
      if (iconFile && inserted) {
        const url = await uploadIcon(inserted.id);
        if (url) await supabase.from("technologies").update({ icon_url: url }).eq("id", inserted.id);
      }
    } else {
      let icon_url: string | null = existingIconUrl || null;
      if (iconFile && editingId) {
        const url = await uploadIcon(editingId);
        if (url) icon_url = url;
        else { setSaving(false); return; }
      }
      const { error: e } = await supabase
        .from("technologies")
        .update({ ...form, icon_url })
        .eq("id", editingId);
      if (e) { setError(e.message); setSaving(false); return; }
    }

    await load();
    setSaving(false);
    onToast("success", formMode === "add" ? "Technology added" : "Technology updated");
    close();
  }

  async function remove(id: string) {
    const tech = techs.find(t => t.id === id);
    if (tech?.icon_url?.includes("/technology-icons/")) {
      const parts = tech.icon_url.split("/technology-icons/");
      if (parts.length === 2) {
        await supabase.storage.from("technology-icons").remove([parts[1]]);
      }
    }
    await supabase.from("technologies").delete().eq("id", id);
    const remaining = techs.filter(t => t.id !== id).sort((a, b) => a.sort_order - b.sort_order);
    await Promise.all(remaining.map((t, i) => supabase.from("technologies").update({ sort_order: i }).eq("id", t.id)));
    setDeleteId(null);
    await load();
    onToast("success", "Technology deleted");
  }

  return (
    <>
      {loading ? (
        <div className="crudLoading">Loading…</div>
      ) : (
        <>
          {techs.length === 0 && <div className="crudEmpty">No technologies yet.</div>}
          <div className="techChipGrid">
            {techs.map((t, idx) => (
              <div
                className={`techChip${dragOverId === t.id ? " techChip--dragOver" : ""}`}
                key={t.id}
                draggable
                onDragStart={e => handleDragStart(e, t.id)}
                onDragOver={e => handleDragOver(e, t.id)}
                onDrop={e => handleDrop(e, t.id)}
                onDragEnd={handleDragEnd}
              >
                <span className="techChipOrder">{idx + 1}</span>
                {t.icon_url && (
                  <img src={t.icon_url} alt={t.name} className="techChipIcon" />
                )}
                <span className="techChipName">{t.name}</span>
                <div className="techChipActions">
                  <button className="crudBtn" onClick={() => openEdit(t)}>Edit</button>
                  <button className="crudBtn crudBtn--danger" onClick={() => setDeleteId(t.id)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {formMode !== "none" && (
        <div className="crudOverlay" onClick={close}>
          <div className="crudModal crudModal--sm" onClick={e => e.stopPropagation()}>
            <h3 className="crudModalTitle">
              {formMode === "add" ? "Add Technology" : "Edit Technology"}
            </h3>
            <div className="crudForm">

              <div className="crudFormGroup">
                <label>Name *</label>
                <input
                  value={form.name}
                  onChange={e => setField("name", e.target.value)}
                  placeholder="e.g. React, TypeScript, Sass"
                />
              </div>

              <div className="crudFormGroup">
                <label>Icon Image</label>
                {(iconPreview || existingIconUrl) && (
                  <img
                    className="techIconPreview"
                    src={iconPreview || existingIconUrl}
                    alt="icon preview"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="crudFileInput"
                />
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
            <p>Delete this technology? Projects using it will keep their existing skill list.</p>
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

export { AdminTechnologies };
