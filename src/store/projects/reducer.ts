import {
  GET_PAGINATED_PROJECTS_REQUEST,
  GET_PAGINATED_PROJECTS_SUCCESS,
  GET_PAGINATED_PROJECTS_FAILURE,
  CREATE_PROJECT_REQUEST,
  CREATE_PROJECT_SUCCESS,
  CREATE_PROJECT_FAILURE,
} from "./actions";

const initialState = {
  paginated: { data: [], total: 0, page: 1, pageSize: 6 },
  loading: false,
  error: null,
};

export default function projectReducer(state = initialState, action: any) {
  switch (action.type) {
    case GET_PAGINATED_PROJECTS_REQUEST:
    case CREATE_PROJECT_REQUEST:
      return { ...state, loading: true };

    case GET_PAGINATED_PROJECTS_SUCCESS:
      return {
        ...state,
        loading: false,
        paginated: {
          data: action.payload.data,
          total: action.payload.total,
          page: action.payload.page,
          pageSize: action.payload.pageSize,
        },
      };

    case CREATE_PROJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        paginated: {
          ...state.paginated,
          data: [action.payload, ...state.paginated.data],
        },
      };

    case GET_PAGINATED_PROJECTS_FAILURE:
    case CREATE_PROJECT_FAILURE:
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
}
