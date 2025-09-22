// src/services/api.service.ts
import axios, { AxiosResponse } from 'axios';
import { PROJECT_ENDPOINTS } from '@/utils/constants';
import { Project, CreateProjectDto, UpdateProjectDto, PaginatedResult } from '@/types/project.types';

// Configuration Axios avec intercepteurs
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Récupérer le token depuis MSAL
    const token = getIdTokenFromMsal(); // À implémenter avec MSAL
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonction pour récupérer le token MSAL (à implémenter)
const getIdTokenFromMsal = (): string | null => {
  // TODO: Intégrer avec MSAL pour récupérer l'ID token
  // const account = msalInstance.getAllAccounts()[0];
  // return account?.idToken || null;
  return null; // Temporaire
};

export const projectApi = {
  // Récupérer tous les projets
  getAllProjects: (): Promise<AxiosResponse<Project[]>> => {
    return apiClient.get(PROJECT_ENDPOINTS.GET_ALL);
  },

  // Récupérer les projets paginés
  getPaginatedProjects: (page: number = 1, pageSize: number = 6): Promise<AxiosResponse<PaginatedResult<Project>>> => {
    return apiClient.get(PROJECT_ENDPOINTS.GET_PAGINATED, {
      params: { page, pageSize }
    });
  },

  // Créer un nouveau projet
  createProject: (project: CreateProjectDto): Promise<AxiosResponse<Project>> => {
    return apiClient.post(PROJECT_ENDPOINTS.CREATE, project);
  },

  // Mettre à jour un projet
  updateProject: (project: UpdateProjectDto): Promise<AxiosResponse<Project>> => {
    return apiClient.put(PROJECT_ENDPOINTS.UPDATE(project.id), project);
  },

  // Supprimer un projet
  deleteProject: (id: number): Promise<AxiosResponse<void>> => {
    return apiClient.delete(PROJECT_ENDPOINTS.DELETE(id));
  },
};