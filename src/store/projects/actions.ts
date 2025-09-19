import axios from "axios";
import settings from "@/settings"; // contient PROJECT_URL

// Types d'actions
export const GET_PAGINATED_PROJECTS_REQUEST = "GET_PAGINATED_PROJECTS_REQUEST";
export const GET_PAGINATED_PROJECTS_SUCCESS = "GET_PAGINATED_PROJECTS_SUCCESS";
export const GET_PAGINATED_PROJECTS_FAILURE = "GET_PAGINATED_PROJECTS_FAILURE";

export const CREATE_PROJECT_REQUEST = "CREATE_PROJECT_REQUEST";
export const CREATE_PROJECT_SUCCESS = "CREATE_PROJECT_SUCCESS";
export const CREATE_PROJECT_FAILURE = "CREATE_PROJECT_FAILURE";

// Action : récupérer les projets paginés
export const getPaginatedProjects = (page = 1, pageSize = 6) => async (dispatch: any) => {
  dispatch({ type: GET_PAGINATED_PROJECTS_REQUEST });

  try {
    const response = await axios.get(`${settings.PROJECT_URL}/paginate`, {
      params: { page, pageSize },
    });

    dispatch({ type: GET_PAGINATED_PROJECTS_SUCCESS, payload: response.data });
    return response.data;
  } catch (error: any) {
    dispatch({ type: GET_PAGINATED_PROJECTS_FAILURE, error: error.message });
    throw error;
  }
};

// Action : créer un projet
export const createProject = (project: any) => async (dispatch: any) => {
  dispatch({ type: CREATE_PROJECT_REQUEST });
  try {
    const response = await axios.post(settings.PROJECT_URL, project);
    dispatch({ type: CREATE_PROJECT_SUCCESS, payload: response.data });
    return response.data;
  } catch (error: any) {
    dispatch({ type: CREATE_PROJECT_FAILURE, error: error.message });
    throw error;
  }
};
