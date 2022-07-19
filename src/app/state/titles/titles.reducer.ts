import { createReducer, on } from "@ngrx/store"
import { Title } from "src/app/model/title.model";
import { getInitialTitlesAction } from "./titles.action";
import { initialState } from "./titles.state";

const _titlesReducer = createReducer(
  initialState,
  on(getInitialTitlesAction, (state, action) => {
    let titles = action.titles;
    return {
      ...state,
      titles: titles,
    };
  }),
);

export function titlesReducer(state, action) {
  return _titlesReducer(state, action);
}
