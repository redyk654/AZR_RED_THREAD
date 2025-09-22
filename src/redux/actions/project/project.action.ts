// src/redux/actions/project/project.action.ts
import { Dispatch } from 'redux';
import { projectApi } from '@/services/api.service';
import { CreateProjectDto, UpdateProjectDto } from '@/types/project.types';

// Types d'actions
export const PROJECT_ACTION_TYPES = {
  // Get All Projects
  GET_ALL_PROJECTS_REQUEST: 'GET_ALL_PROJECTS_REQUEST',
  GET_ALL_PROJECTS_SUCCESS: 'GET_ALL_PROJECTS_SUCCESS',
  GET_ALL_PROJECTS_FAILURE: 'GET_ALL_PROJECTS_FAILURE',
  
  // Get Paginated Projects
  GET_PAGINATED_PROJECTS_REQUEST: 'GET_PAGINATED_PROJECTS_REQUEST',
  GET_PAGINATED_PROJECTS_SUCCESS: 'GET_PAGINATED_PROJECTS_SUCCESS',
  GET_PAGINATED_PROJECTS_FAILURE: 'GET_PAGINATED_PROJECTS_FAILURE',
  
  // Create Project
  CREATE_PROJECT_REQUEST: 'CREATE_PROJECT_REQUEST',
  CREATE_PROJECT_SUCCESS: 'CREATE_PROJECT_SUCCESS',
  CREATE_PROJECT_FAILURE: 'CREATE_PROJECT_FAILURE',
  
  // Update Project
  UPDATE_PROJECT_REQUEST: 'UPDATE_PROJECT_REQUEST',
  UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
  UPDATE_PROJECT_FAILURE: 'UPDATE_PROJECT_FAILURE',
  
  // Delete Project
  DELETE_PROJECT_REQUEST: 'DELETE_PROJECT_REQUEST',
  DELETE_PROJECT_SUCCESS: 'DELETE_PROJECT_SUCCESS',
  DELETE_PROJECT_FAILURE: 'DELETE_PROJECT_FAILURE',
  
  // UI State
  SET_SELECTED_PROJECT: 'SET_SELECTED_PROJECT',
  CLEAR_ERROR: 'CLEAR_ERROR',
} as const;

// Actions créateurs
export const getAllProjects = () => async (dispatch: Dispatch) => {
  dispatch({ type: PROJECT_ACTION_TYPES.GET_ALL_PROJECTS_REQUEST });
  
  try {
    const response = await projectApi.getAllProjects();
    dispatch({
      type: PROJECT_ACTION_TYPES.GET_ALL_PROJECTS_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des projets';
    dispatch({
      type: PROJECT_ACTION_TYPES.GET_ALL_PROJECTS_FAILURE,
      error: errorMessage
    });
    throw error;
  }
};

export const getPaginatedProjects = (page: number = 1, pageSize: number = 5) => async (dispatch: Dispatch) => {
  dispatch({ type: PROJECT_ACTION_TYPES.GET_PAGINATED_PROJECTS_REQUEST });
  
  try {
    const response = await projectApi.getPaginatedProjects(page, pageSize);
    dispatch({
      type: PROJECT_ACTION_TYPES.GET_PAGINATED_PROJECTS_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des projets';
    dispatch({
      type: PROJECT_ACTION_TYPES.GET_PAGINATED_PROJECTS_FAILURE,
      error: errorMessage
    });
    throw error;
  }
};

export const createProject = (project: CreateProjectDto) => async (dispatch: Dispatch) => {
  dispatch({ type: PROJECT_ACTION_TYPES.CREATE_PROJECT_REQUEST });
  
  try {
    const response = await projectApi.createProject(project);
    dispatch({
      type: PROJECT_ACTION_TYPES.CREATE_PROJECT_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création du projet';
    dispatch({
      type: PROJECT_ACTION_TYPES.CREATE_PROJECT_FAILURE,
      error: errorMessage
    });
    throw error;
  }
};

export const updateProject = (project: UpdateProjectDto) => async (dispatch: Dispatch) => {
  dispatch({ type: PROJECT_ACTION_TYPES.UPDATE_PROJECT_REQUEST });
  
  try {
    const response = await projectApi.updateProject(project);
    dispatch({
      type: PROJECT_ACTION_TYPES.UPDATE_PROJECT_SUCCESS,
      payload: response.data
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du projet';
    dispatch({
      type: PROJECT_ACTION_TYPES.UPDATE_PROJECT_FAILURE,
      error: errorMessage
    });
    throw error;
  }
};

export const deleteProject = (id: number) => async (dispatch: Dispatch) => {
  dispatch({ type: PROJECT_ACTION_TYPES.DELETE_PROJECT_REQUEST });
  
  try {
    await projectApi.deleteProject(id);
    dispatch({
      type: PROJECT_ACTION_TYPES.DELETE_PROJECT_SUCCESS,
      payload: id
    });
    return true;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression du projet';
    dispatch({
      type: PROJECT_ACTION_TYPES.DELETE_PROJECT_FAILURE,
      error: errorMessage
    });
    throw error;
  }
};

export const setSelectedProject = (project: any) => ({
  type: PROJECT_ACTION_TYPES.SET_SELECTED_PROJECT,
  payload: project
});

export const clearError = () => ({
  type: PROJECT_ACTION_TYPES.CLEAR_ERROR
});