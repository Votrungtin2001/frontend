import { User } from "src/app/model/user.model";

export interface UsersState {
  users: User[];
}

export const initialState: UsersState = {
  users: []
}
