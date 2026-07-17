export type Mode = "Light" | "Dark";

export type ProjectType = "project" | "company" | "learning";

export interface Project {
  name: string;
  link: string;
  repository?: string;
  backendRepository?: string;
  repositoryPrivate?: boolean;
  backendRepositoryPrivate?: boolean;
  coverUrl?: string;
  skillList: string[];
  info: string;
  startDate?: string;
  endDate?: string;
  type: ProjectType;
}

export interface Certification {
  name: string;
  link: string;
  date: string;
}
