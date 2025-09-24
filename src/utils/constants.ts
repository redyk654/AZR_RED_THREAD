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

export const ADMIN_USERS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/admin/users`,                     // GET -> liste utilisateurs + rôle
  GET_BY_ID: (id: number) => `${API_BASE_URL}/admin/users/${id}`,
  CREATE: `${API_BASE_URL}/admin/users`,                      // si besoin
  UPDATE: (id: number) => `${API_BASE_URL}/admin/users/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/admin/users/${id}`,
  ASSIGN_ROLE: (userId: number) => `${API_BASE_URL}/admin/users/${userId}/role`, // POST { roleId }
} as const;

export const ROLE_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/admin/roles`,                     // GET
  GET_BY_ID: (id: number) => `${API_BASE_URL}/admin/roles/${id}`, // GET
  CREATE: `${API_BASE_URL}/admin/roles`,                      // POST CreateRoleDto
  UPDATE: (id: number) => `${API_BASE_URL}/admin/roles/${id}`, // PUT UpdateRoleDto
  DELETE: (id: number) => `${API_BASE_URL}/admin/roles/${id}`, // DELETE
  GET_PRIVILEGES: (roleId: number) => `${API_BASE_URL}/admin/roles/${roleId}/privileges`, // GET
  ASSIGN_PRIVILEGE: (roleId: number, privilegeId: number) =>
    `${API_BASE_URL}/admin/roles/${roleId}/assign-privilege/${privilegeId}`, // POST no body
  REMOVE_PRIVILEGE: (roleId: number, privilegeId: number) =>
    `${API_BASE_URL}/admin/roles/${roleId}/remove-privilege/${privilegeId}`, // DELETE
} as const;

export const PRIVILEGE_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/admin/privileges`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/admin/privileges/${id}`,
  CREATE: `${API_BASE_URL}/admin/privileges`,
  UPDATE: (id: number) => `${API_BASE_URL}/admin/privileges/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/admin/privileges/${id}`,
} as const;

export const COLORS = {
  PRIMARY: '#1b365f',
  PRIMARY_HOVER: '#2c4a7a',
  SUCCESS: '#4caf50',
  ERROR: '#f44336',
  WARNING: '#ff9800',
} as const;

export const DEFAULT_PAGE_SIZE = 2;