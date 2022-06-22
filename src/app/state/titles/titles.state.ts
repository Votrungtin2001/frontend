import { Title } from "src/app/model/title.model";

export interface TitlesState {
  titles: Title[];
}

export const initialState: TitlesState = {
  titles: []
}
