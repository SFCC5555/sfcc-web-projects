-- Projects table
CREATE TABLE projects (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  link        text        NOT NULL,
  repository          text,
  backend_repository  text,
  private_repository  text,
  skill_list  text[]      NOT NULL DEFAULT '{}',
  info        text        NOT NULL,
  date        text,
  type        text        NOT NULL DEFAULT 'project',
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Certifications table
CREATE TABLE certifications (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  link        text        NOT NULL,
  date        text        NOT NULL,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Public read (portfolio visitors)
CREATE POLICY "public_read_projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "public_read_certifications"
  ON certifications FOR SELECT USING (true);

-- Authenticated write (admin panel)
CREATE POLICY "admin_write_projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_write_certifications"
  ON certifications FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
