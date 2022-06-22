import { titlesReducer } from "../titles/titles.reducer";
import { TitlesState } from "../titles/titles.state";
import { usersReducer } from "../users/users.reducer";
import { UsersState } from "../users/users.state";

export interface AppState {
  titles: TitlesState,
  users: UsersState
}

export const appReducer = {
  titles: titlesReducer,
  users: usersReducer
}
