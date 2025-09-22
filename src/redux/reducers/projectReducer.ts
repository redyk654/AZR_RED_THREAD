// src/redux/reducers/projectReducer.ts
import { PROJECT_ACTION_TYPES } from '@/redux/actions/project/project.action';
import { ProjectState } from '@/types/project.types';

const initialState: ProjectState = {
  projects: [],
  paginated: {
    data: [],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 0,
    hasPrevious: false,
    hasNext: false,
  },
  loading: false,
  error: null,
  selectedProject: null,
};

export const projectReducer = (state = initialState, action: any): ProjectState => {
  switch (action.type) {
    // Get All Projects
    case PROJECT_ACTION_TYPES.GET_ALL_PROJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PROJECT_ACTION_TYPES.GET_ALL_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: action.payload,
        error: null,
      };

    case PROJECT_ACTION_TYPES.GET_ALL_PROJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // Get Paginated Projects
    case PROJECT_ACTION_TYPES.GET_PAGINATED_PROJECTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PROJECT_ACTION_TYPES.GET_PAGINATED_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        paginated: {
          data: action.payload.data,
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          hasPrevious: action.payload.hasPrevious,
          hasNext: action.payload.hasNext,
        },
        error: null,
      };

    case PROJECT_ACTION_TYPES.GET_PAGINATED_PROJECTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // Create Project
    case PROJECT_ACTION_TYPES.CREATE_PROJECT_REQUEST:
    case PROJECT_ACTION_TYPES.UPDATE_PROJECT_REQUEST:
    case PROJECT_ACTION_TYPES.DELETE_PROJECT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PROJECT_ACTION_TYPES.CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: [action.payload, ...state.projects],
        error: null,
      };

    case PROJECT_ACTION_TYPES.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: state.projects.map(project => 
          project.id === action.payload.id ? action.payload : project
        ),
        paginated: {
          ...state.paginated,
          data: state.paginated.data.map(project => 
            project.id === action.payload.id ? action.payload : project
          )
        },
        error: null,
      };

    case PROJECT_ACTION_TYPES.DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        projects: state.projects.filter(project => project.id !== action.payload),
        paginated: {
          ...state.paginated,
          data: state.paginated.data.filter(project => project.id !== action.payload),
          total: Math.max(0, state.paginated.total - 1),
        },
        error: null,
      };

    case PROJECT_ACTION_TYPES.CREATE_PROJECT_FAILURE:
    case PROJECT_ACTION_TYPES.UPDATE_PROJECT_FAILURE:
    case PROJECT_ACTION_TYPES.DELETE_PROJECT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case PROJECT_ACTION_TYPES.SET_SELECTED_PROJECT:
      return {
        ...state,
        selectedProject: action.payload,
      };

    case PROJECT_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};