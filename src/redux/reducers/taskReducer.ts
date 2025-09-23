import { TASK_ACTION_TYPES } from "../actions/task/task.action";
import { Task } from "@/types/task.types";

interface TaskState {
    current: any;
    tasks: Task[];
    loading: boolean;
    error: string | null;
    selectedTask: Task | null;
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
    selectedTask: null,
    current: undefined
};

export const taskReducer = (state = initialState, action: any): TaskState => {
    switch (action.type) {
        // Get All Tasks
        case TASK_ACTION_TYPES.GET_ALL_TASKS_REQUEST:
            return { ...state, loading: true, error: null };
        case TASK_ACTION_TYPES.GET_ALL_TASKS_SUCCESS:
            return { ...state, loading: false, tasks: action.payload };
        case TASK_ACTION_TYPES.GET_ALL_TASKS_FAILURE:
            return { ...state, loading: false, error: action.error };

        // Get Tasks by Project
        case TASK_ACTION_TYPES.GET_TASKS_BY_PROJECT_REQUEST:
            return { ...state, loading: true, error: null };
        case TASK_ACTION_TYPES.GET_TASKS_BY_PROJECT_SUCCESS:
            return { ...state, loading: false, tasks: action.payload.tasks };
        case TASK_ACTION_TYPES.GET_TASKS_BY_PROJECT_FAILURE:
            return { ...state, loading: false, error: action.error };

        // Create Task
        case TASK_ACTION_TYPES.CREATE_TASK_REQUEST:
            return { ...state, loading: true, error: null };
        case TASK_ACTION_TYPES.CREATE_TASK_SUCCESS:
            return { ...state, loading: false, tasks: [...state.tasks, action.payload] };
        case TASK_ACTION_TYPES.CREATE_TASK_FAILURE:
            return { ...state, loading: false, error: action.error };

        // Update Task
        case TASK_ACTION_TYPES.UPDATE_TASK_REQUEST:
            return { ...state, loading: true, error: null };
        case TASK_ACTION_TYPES.UPDATE_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                tasks: state.tasks.map((task) =>
                    task.id === action.payload.id ? action.payload : task
                ),
            };
        case TASK_ACTION_TYPES.UPDATE_TASK_FAILURE:
            return { ...state, loading: false, error: action.error };

        // Delete Task
        case TASK_ACTION_TYPES.DELETE_TASK_REQUEST:
            return { ...state, loading: true, error: null };
        case TASK_ACTION_TYPES.DELETE_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                tasks: state.tasks.filter((task) => task.id !== action.payload),
            };
        case TASK_ACTION_TYPES.DELETE_TASK_FAILURE:
            return { ...state, loading: false, error: action.error };

        // UI State
        case TASK_ACTION_TYPES.SET_SELECTED_TASK:
            return { ...state, selectedTask: action.payload };
        case TASK_ACTION_TYPES.CLEAR_ERROR:
            return { ...state, error: null };

        default:
            return state;
    }
};
