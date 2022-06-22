import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TitlesState } from "./titles.state";

export const TITLE_STATE_NAME = 'titles'

const getTitlesState = createFeatureSelector<TitlesState>(TITLE_STATE_NAME);

export const getInitialTitles = createSelector(getTitlesState, (state) => {
  return state.titles;
})



