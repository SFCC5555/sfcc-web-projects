import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import "../../styles/admin/AdminCrud.scss";

interface AdminAboutProps {
  onToast: (type: "success" | "error", message: string) => void;
}

interface About {
  id: string;
  description: string;
  github_url: string;
  linkedin_url: string;
  cv_url: string | null;
}

function AdminAbout({ onToast }: AdminAboutProps) {
  const [aboutId, setAboutId] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [existingCvUrl, setExistingCvUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("about").select("*").single();
    if (data) {
      const a = data as About;
      setAboutId(a.id);
      setDescription(a.description);
      setGithubUrl(a.github_url ?? "");
      setLinkedinUrl(a.linkedin_url ?? "");
      setExistingCvUrl(a.cv_url ?? "");
    }
    setLoading(false);
  }

  async function uploadCv(): Promise<string | null> {
    if (!cvFile) return null;
    const { error: uploadErr } = await supabase.storage
      .from("about-cv")
      .upload("cv.pdf", cvFile, { upsert: true, contentType: "application/pdf" });
    if (uploadErr) { setError(`CV upload failed: ${uploadErr.message}`); return null; }
    const { data } = supabase.storage.from("about-cv").getPublicUrl("cv.pdf");
    return data.publicUrl;
  }

  async function save() {
    if (!description.trim()) { setError("Description is required."); return; }
    if (!aboutId) return;
    setSaving(true);
    setError(null);

    let cv_url: string | null = existingCvUrl || null;
    if (cvFile) {
      const url = await uploadCv();
      if (url) {
        cv_url = url;
        setExistingCvUrl(url);
        setCvFile(null);
      } else {
        setSaving(false);
        return;
      }
    }

    const { error: e } = await supabase
      .from("about")
      .update({
        description,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        cv_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", aboutId);

    if (e) { setError(e.message); setSaving(false); return; }
    setSaving(false);
    onToast("success", "About updated");
  }

  if (loading) return <div className="crudLoading">Loading…</div>;

  return (
    <div className="aboutAdminForm">
      <div className="crudForm">

        <div className="crudFormGroup">
          <label>Description *</label>
          <textarea
            rows={7}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="crudFormRow2">
          <div className="crudFormGroup">
            <label>GitHub URL</label>
            <input
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="crudFormGroup">
            <label>LinkedIn URL</label>
            <input
              value={linkedinUrl}
              onChange={e => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <div className="crudFormGroup">
          <label>CV (PDF)</label>
          {existingCvUrl && !cvFile && (
            <p className="crudMuted" style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>
              Current:{" "}
              <a href={existingCvUrl} target="_blank" rel="noreferrer" style={{ color: "inherit", opacity: 0.8 }}>
                View CV
              </a>
              {existingCvUrl.includes("/about-cv/") ? " — stored PDF" : " — external link"}
            </p>
          )}
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setCvFile(e.target.files?.[0] ?? null)}
            className="crudFileInput"
          />
          {cvFile && (
            <p className="crudMuted" style={{ margin: "4px 0 0", fontSize: "1.1rem" }}>
              Selected: {cvFile.name}
            </p>
          )}
        </div>

      </div>

      {error && <p className="crudError" style={{ marginTop: 12 }}>{error}</p>}

      <div className="crudModalFooter" style={{ marginTop: 20 }}>
        <button className="crudBtn crudBtn--primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export { AdminAbout };
