// src/redux/reducers/index.ts
import { combineReducers } from 'redux';
import { projectReducer } from './projectReducer';

export const rootReducer = combineReducers({
  project: projectReducer,
});

export type RootState = ReturnType<typeof rootReducer>;