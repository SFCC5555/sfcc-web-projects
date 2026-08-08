export type Mode = "Light" | "Dark";

export type ProjectType = "project" | "company" | "learning" | "technical-test";

export interface Project {
  id: string;
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
  updatedAt?: string;
}

export interface Certification {
  name: string;
  link: string;
  date: string;
}
