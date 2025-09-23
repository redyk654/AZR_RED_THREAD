// src/redux/reducers/index.ts
import { combineReducers } from 'redux';
import { projectReducer } from './projectReducer';
import { taskReducer } from './taskReducer';

export const rootReducer = combineReducers({
  project: projectReducer,
  task: taskReducer, // à ajouter
});

export type RootState = ReturnType<typeof rootReducer>;