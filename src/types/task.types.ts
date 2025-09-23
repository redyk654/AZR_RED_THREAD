export interface Task {
  id: number;
  label: string;
  description?: string;
  startDate: string;   // ISO string e.g. "2025-09-23T00:00:00"
  endDate: string;     // ISO string
  statut: string;
  projectId: number;
  projectName?: string;

  createdAt: string;
  createdBy: number;
  updatedAt?: string;
  updatedBy?: number;
  isActive: boolean;

  durationInDays?: number;
  isOverdue?: boolean;
}

export interface CreateTaskDto {
  label: string;
  description?: string;
  startDate: string; // ISO date string (YYYY-MM-DD or full ISO)
  endDate: string;
  projectId: number;
  statut?: string; // optional, default "À faire"
}

export interface UpdateTaskDto {
  id: number;
  label: string;
  description?: string;
  startDate: string;
  endDate: string;
  projectId: number;
  statut: string;
}
