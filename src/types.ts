export type Mode = "Light" | "Dark";

export type ProjectType = "project" | "contribution";

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
  date?: string;
  type: ProjectType;
}

export interface Certification {
  name: string;
  link: string;
  date: string;
}
