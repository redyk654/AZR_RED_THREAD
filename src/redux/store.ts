import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { projectReducer } from "@/redux/reducers/projectReducer";
import { taskReducer } from "./reducers/taskReducer";

const rootReducer = combineReducers({
  project: projectReducer,
  task: taskReducer, // à ajouter
});

export const store = configureStore({
  reducer: rootReducer,
});

// Typings pratiques pour useSelector / useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
