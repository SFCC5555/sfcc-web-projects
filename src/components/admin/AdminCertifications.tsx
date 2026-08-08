import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminCrud.scss";

export interface CertificationsHandle {
  openAdd: () => void;
}

interface AdminCertificationsProps {
  onToast: (type: "success" | "error", message: string) => void;
}

interface Certification {
  id: string;
  name: string;
  link: string;
  date: string;
  sort_order: number;
}

interface FormState {
  name: string;
  sort_order: number;
}

type LinkMode = "url" | "pdf";

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

const EMPTY: FormState = { name: "", sort_order: 0 };

const AdminCertifications = forwardRef<CertificationsHandle, AdminCertificationsProps>(({ onToast }, ref) => {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"none" | "add" | "edit">("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [dateInput, setDateInput] = useState("");
  const [linkMode, setLinkMode] = useState<LinkMode>("url");
  const [urlInput, setUrlInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [existingLink, setExistingLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({ openAdd }));
  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("certifications").select("*").order("sort_order");
    if (data) setCerts(data);
    setLoading(false);
  }

  function resetExtras() {
    setDateInput("");
    setLinkMode("url");
    setUrlInput("");
    setPdfFile(null);
    setExistingLink("");
  }

  function openAdd() {
    setForm({ name: "", sort_order: 0 });
    resetExtras();
    setEditingId(null);
    setFormMode("add");
    setError(null);
  }

  function openEdit(c: Certification) {
    setForm({ name: c.name, sort_order: c.sort_order });
    setDateInput(displayToMonthValue(c.date));
    const isUrl = c.link.startsWith("h");
    setLinkMode(isUrl ? "url" : "pdf");
    setUrlInput(isUrl ? c.link : "");
    setExistingLink(c.link);
    setPdfFile(null);
    setEditingId(c.id);
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
    const list = [...certs];
    const fromIdx = list.findIndex(c => c.id === dragId.current);
    const toIdx = list.findIndex(c => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) { setDragOverId(null); return; }
    const [removed] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, removed);
    const updated = list.map((c, i) => ({ ...c, sort_order: i }));
    setCerts(updated);
    await Promise.all(updated.map(c => supabase.from("certifications").update({ sort_order: c.sort_order }).eq("id", c.id)));
    dragId.current = null;
    setDragOverId(null);
  }

  function handleDragEnd() {
    setDragOverId(null);
    dragId.current = null;
  }

  function switchLinkMode(mode: LinkMode) {
    setLinkMode(mode);
    setError(null);
  }

  async function uploadPdf(name: string): Promise<string | null> {
    if (!pdfFile) return null;
    const slug = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const path = `${slug}.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from("certification-pdfs")
      .upload(path, pdfFile, { upsert: true, contentType: "application/pdf" });
    if (uploadErr) { setError(`PDF upload failed: ${uploadErr.message}`); return null; }
    const { data } = supabase.storage.from("certification-pdfs").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!dateInput) { setError("Date is required."); return; }

    let link = "";
    if (linkMode === "url") {
      if (!urlInput.trim()) { setError("URL is required."); return; }
      link = urlInput.trim();
    } else {
      if (!pdfFile && !existingLink) { setError("Please upload a PDF file."); return; }
      if (pdfFile) {
        setSaving(true);
        const url = await uploadPdf(form.name);
        if (!url) { setSaving(false); return; }
        link = url;
      } else {
        link = existingLink;
      }
    }

    setSaving(true);
    setError(null);
    const payload = { ...form, date: monthValueToDisplay(dateInput), link };

    if (formMode === "add") {
      if (certs.length > 0) {
        const toShift = certs.filter(c => c.sort_order >= payload.sort_order);
        await Promise.all(
          toShift.map(c => supabase.from("certifications").update({ sort_order: c.sort_order + 1 }).eq("id", c.id))
        );
      }
      const { error: e } = await supabase.from("certifications").insert([payload]);
      if (e) { setError(e.message); setSaving(false); return; }
    } else {
      const { error: e } = await supabase.from("certifications").update(payload).eq("id", editingId);
      if (e) { setError(e.message); setSaving(false); return; }
    }

    await load();
    setSaving(false);
    onToast("success", formMode === "add" ? "Certification added" : "Certification updated");
    close();
  }

  async function remove(id: string) {
    const cert = certs.find(c => c.id === id);
    if (cert?.link?.includes("/certification-pdfs/")) {
      const parts = cert.link.split("/certification-pdfs/");
      if (parts.length === 2) {
        await supabase.storage.from("certification-pdfs").remove([parts[1]]);
      }
    }
    await supabase.from("certifications").delete().eq("id", id);
    const remaining = certs.filter(c => c.id !== id).sort((a, b) => a.sort_order - b.sort_order);
    await Promise.all(remaining.map((c, i) => supabase.from("certifications").update({ sort_order: i }).eq("id", c.id)));
    setDeleteId(null);
    await load();
    onToast("success", "Certification deleted");
  }

  return (
    <>
      {loading ? (
        <div className="crudLoading">Loading…</div>
      ) : (
        <div className="crudTable crudTable--certs">
          <div className="crudTableHead">
            <span></span><span>Name</span><span>Date</span><span></span>
          </div>
          {certs.length === 0 && <div className="crudEmpty">No certifications yet.</div>}
          {certs.map((c, idx) => (
            <div
              className={`crudTableRow${dragOverId === c.id ? " crudTableRow--dragOver" : ""}`}
              key={c.id}
              draggable
              onDragStart={e => handleDragStart(e, c.id)}
              onDragOver={e => handleDragOver(e, c.id)}
              onDrop={e => handleDrop(e, c.id)}
              onDragEnd={handleDragEnd}
            >
              <span className="crudCell crudDragHandle">{idx + 1}</span>
              <span className="crudCell crudName">
                <a href={c.link.startsWith("h") ? c.link : "#"} target="_blank" rel="noreferrer">
                  {c.name}
                </a>
              </span>
              <span className="crudCell crudMuted">{c.date}</span>
              <span className="crudCell crudActions">
                <button className="crudBtn" onClick={() => openEdit(c)}>Edit</button>
                <button className="crudBtn crudBtn--danger" onClick={() => setDeleteId(c.id)}>Del</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {formMode !== "none" && (
        <div className="crudOverlay" onClick={close}>
          <div className="crudModal crudModal--sm" onClick={e => e.stopPropagation()}>
            <h3 className="crudModalTitle">
              {formMode === "add" ? "Add Certification" : "Edit Certification"}
            </h3>
            <div className="crudForm">

              <div className="crudFormGroup">
                <label>Name *</label>
                <input value={form.name} onChange={e => setField("name", e.target.value)} />
              </div>

              <div className="crudFormGroup">
                <label>Date *</label>
                <input type="month" value={dateInput} onChange={e => setDateInput(e.target.value)} onClick={e => (e.currentTarget as HTMLInputElement).showPicker?.()} />
              </div>

              {/* Link type toggle */}
              <div className="crudFormGroup">
                <label>Certificate source</label>
                <div className="crudLinkToggle">
                  <button
                    type="button"
                    className={`crudLinkToggleBtn${linkMode === "url" ? " crudLinkToggleBtn--active" : ""}`}
                    onClick={() => switchLinkMode("url")}
                  >
                    External link
                  </button>
                  <button
                    type="button"
                    className={`crudLinkToggleBtn${linkMode === "pdf" ? " crudLinkToggleBtn--active" : ""}`}
                    onClick={() => switchLinkMode("pdf")}
                  >
                    Upload PDF
                  </button>
                </div>
              </div>

              {linkMode === "url" ? (
                <div className="crudFormGroup">
                  <label>URL *</label>
                  <input
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://freecodecamp.org/certification/…"
                  />
                </div>
              ) : (
                <div className="crudFormGroup">
                  <label>PDF file *</label>
                  {existingLink && !existingLink.startsWith("h") && !pdfFile && (
                    <p className="crudMuted" style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>
                      Current: {existingLink}
                    </p>
                  )}
                  {existingLink && existingLink.includes("/certification-pdfs/") && !pdfFile && (
                    <p className="crudMuted" style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>
                      Current: stored PDF — upload a new file to replace
                    </p>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => setPdfFile(e.target.files?.[0] ?? null)}
                    className="crudFileInput"
                  />
                  {pdfFile && (
                    <p className="crudMuted" style={{ margin: "4px 0 0", fontSize: "1.1rem" }}>
                      Selected: {pdfFile.name}
                    </p>
                  )}
                </div>
              )}

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
            <p>Delete this certification? This cannot be undone.</p>
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

export { AdminCertifications };
