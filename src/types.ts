export type Mode = "Light" | "Dark";

export interface Project {
  name: string;
  link: string;
  repository?: string;
  backendRepository?: string;
  privateRepository?: string;
  skillList: string[];
  info: string;
  date?: string;
}

export interface Certification {
  name: string;
  link: string;
  date: string;
}
