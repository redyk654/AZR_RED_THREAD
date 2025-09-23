// src/utils/constants.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7178/api';

export const PROJECT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/project`,
  GET_PAGINATED: `${API_BASE_URL}/project/paginate`,
  CREATE: `${API_BASE_URL}/project`,
  UPDATE: (id: number) => `${API_BASE_URL}/project/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/project/${id}`,
} as const;

export const TASK_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/tasks`,
  GET_BY_PROJECT: (projectId: number) => `${API_BASE_URL}/tasks/projectId?projectId=${projectId}`,
  CREATE: `${API_BASE_URL}/tasks`,
  UPDATE: (id: number) => `${API_BASE_URL}/tasks/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/tasks/${id}`,
} as const;

export const COLORS = {
  PRIMARY: '#1b365f',
  PRIMARY_HOVER: '#2c4a7a',
  SUCCESS: '#4caf50',
  ERROR: '#f44336',
  WARNING: '#ff9800',
} as const;

export const DEFAULT_PAGE_SIZE = 2;