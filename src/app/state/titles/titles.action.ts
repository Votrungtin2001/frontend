import { createAction, props } from "@ngrx/store";
import { Title } from "src/app/model/title.model";

export const GET_INITIAL_TITLES_ACTION = '[titles page] get initial titles';

export const getInitialTitlesAction = createAction(GET_INITIAL_TITLES_ACTION, props<{titles: Title[]}>());
