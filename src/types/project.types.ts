export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: number;
  updatedBy?: number;
  durationInDays: number;
  isOverdue: boolean;
  status: 'À venir' | 'En cours' | 'Terminé';
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy: number;
}

export interface UpdateProjectDto {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  updatedBy: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ProjectState {
  projects: Project[];
  paginated: PaginatedResult<Project>;
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
}