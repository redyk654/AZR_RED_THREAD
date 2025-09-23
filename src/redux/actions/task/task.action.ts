import { Dispatch } from 'redux';
import { taskApi } from '@/services/api.service';;
import { CreateTaskDto, UpdateTaskDto } from "@/types/task.types";

// Action types
export const TASK_ACTION_TYPES = {
    // Get All Tasks
    GET_ALL_TASKS_REQUEST: 'GET_ALL_TASKS_REQUEST',
    GET_ALL_TASKS_SUCCESS: 'GET_ALL_TASKS_SUCCESS',
    GET_ALL_TASKS_FAILURE: 'GET_ALL_TASKS_FAILURE',

    // Get Tasks by Project
    GET_TASKS_BY_PROJECT_REQUEST: 'GET_TASKS_BY_PROJECT_REQUEST',
    GET_TASKS_BY_PROJECT_SUCCESS: 'GET_TASKS_BY_PROJECT_SUCCESS',
    GET_TASKS_BY_PROJECT_FAILURE: 'GET_TASKS_BY_PROJECT_FAILURE',

    // Create Task
    CREATE_TASK_REQUEST: 'CREATE_TASK_REQUEST',
    CREATE_TASK_SUCCESS: 'CREATE_TASK_SUCCESS',
    CREATE_TASK_FAILURE: 'CREATE_TASK_FAILURE',

    // Update Task
    UPDATE_TASK_REQUEST: 'UPDATE_TASK_REQUEST',
    UPDATE_TASK_SUCCESS: 'UPDATE_TASK_SUCCESS',
    UPDATE_TASK_FAILURE: 'UPDATE_TASK_FAILURE',

    // Delete Task
    DELETE_TASK_REQUEST: 'DELETE_TASK_REQUEST',
    DELETE_TASK_SUCCESS: 'DELETE_TASK_SUCCESS',
    DELETE_TASK_FAILURE: 'DELETE_TASK_FAILURE',

    // UI State
    SET_SELECTED_TASK: 'SET_SELECTED_TASK',
    CLEAR_ERROR: 'CLEAR_ERROR',
} as const;

// Action creators
export const getAllTasks = () => async (dispatch: Dispatch) => {
    dispatch({ type: TASK_ACTION_TYPES.GET_ALL_TASKS_REQUEST });
    try {
        const response = await taskApi.getAllTasks();
        dispatch({
            type: TASK_ACTION_TYPES.GET_ALL_TASKS_SUCCESS,
            payload: response.data
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des tâches';
        dispatch({
            type: TASK_ACTION_TYPES.GET_ALL_TASKS_FAILURE,
            error: errorMessage
        });
        throw error;
    }
};

export const getTasksByProjectId = (projectId: number) => async (dispatch: Dispatch) => {
    dispatch({ type: TASK_ACTION_TYPES.GET_TASKS_BY_PROJECT_REQUEST });
    try {
        const response = await taskApi.getTasksByProjectId(projectId);
        dispatch({
            type: TASK_ACTION_TYPES.GET_TASKS_BY_PROJECT_SUCCESS,
            payload: { projectId, tasks: response.data }
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du chargement des tâches du projet';
        dispatch({
            type: TASK_ACTION_TYPES.GET_TASKS_BY_PROJECT_FAILURE,
            error: errorMessage
        });
        throw error;
    }
};

export const createTask = (task: CreateTaskDto) => async (dispatch: Dispatch) => {
    dispatch({ type: TASK_ACTION_TYPES.CREATE_TASK_REQUEST });
    try {
        const response = await taskApi.createTask(task);
        dispatch({
            type: TASK_ACTION_TYPES.CREATE_TASK_SUCCESS,
            payload: response.data
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de la tâche';
        dispatch({
            type: TASK_ACTION_TYPES.CREATE_TASK_FAILURE,
            error: errorMessage
        });
        throw error;
    }
};

export const updateTask = (task: UpdateTaskDto) => async (dispatch: Dispatch) => {
    dispatch({ type: TASK_ACTION_TYPES.UPDATE_TASK_REQUEST });
    try {
        const response = await taskApi.updateTask(task);
        dispatch({
            type: TASK_ACTION_TYPES.UPDATE_TASK_SUCCESS,
            payload: response.data
        });
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de la tâche';
        dispatch({
            type: TASK_ACTION_TYPES.UPDATE_TASK_FAILURE,
            error: errorMessage
        });
        throw error;
    }
};

export const deleteTask = (id: number) => async (dispatch: Dispatch) => {
    dispatch({ type: TASK_ACTION_TYPES.DELETE_TASK_REQUEST });
    try {
        await taskApi.deleteTask(id);
        dispatch({
            type: TASK_ACTION_TYPES.DELETE_TASK_SUCCESS,
            payload: id
        });
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de la tâche';
        dispatch({
            type: TASK_ACTION_TYPES.DELETE_TASK_FAILURE,
            error: errorMessage
        });
        throw error;
    }
};