export interface Project {
  key: string;
  name: string;
  description?: string;
  statuses: string[];
}

export interface ProjectCreate {
  key: string;
  name: string;
  description?: string;
}